import { Collection, EntitySchema } from 'mikro-orm';
import { Service, ServiceCtor } from './Service';
import { Email, EmailCtor } from './Email';
import { Session, SessionCtor } from './Session';

export class User<
  CustomEmail extends Email<any>,
  CustomSession extends Session<any>,
  CustomService extends Service<any>
> {
  id!: number;

  username?: string;

  services = new Collection<CustomService | Service<any>>(this);

  emails = new Collection<CustomEmail | Email<any>>(this);

  sessions = new Collection<CustomSession | Session<any>>(this);

  deactivated = false;

  createdAt = new Date();

  updatedAt = new Date();

  constructor({ EmailEntity, ServiceEntity, email, password, username }: UserCtorArgs) {
    if (username) {
      this.username = username;
    }
    if (email) {
      this.emails.add(new EmailEntity({ address: email }));
    }
    if (password) {
      this.services.add(new ServiceEntity({ name: 'password', password }));
    }
  }
}

export interface UserCtorArgs {
  EmailEntity: EmailCtor<any>;
  ServiceEntity: ServiceCtor<any>;
  email?: string;
  password?: string;
  username?: string;
}

export type UserCtor = new (args: UserCtorArgs) => User<any, any, any>;

export const getUserSchema = ({
  EmailEntity = Email,
  SessionEntity = Session,
  ServiceEntity = Service,
  abstract = false,
}: {
  EmailEntity?: EmailCtor<any>;
  SessionEntity?: SessionCtor<any>;
  ServiceEntity?: ServiceCtor<any>;
  abstract?: boolean;
} = {}) => {
  return new EntitySchema<User<any, any, any>>({
    class: User,
    abstract,
    properties: {
      id: { type: 'number', primary: true },
      createdAt: { type: 'Date', onCreate: () => new Date(), nullable: true },
      updatedAt: {
        type: 'Date',
        onCreate: () => new Date(),
        onUpdate: () => new Date(),
        nullable: true,
      },
      username: { type: 'string', nullable: true },
      deactivated: { type: 'boolean', default: false, onCreate: () => false },
      services: {
        reference: '1:m',
        entity: () => ServiceEntity?.name ?? Service.name,
        mappedBy: (service) => service.user,
      },
      emails: {
        reference: '1:m',
        entity: () => EmailEntity?.name ?? Email.name,
        mappedBy: (email) => email.user,
      },
      sessions: {
        reference: '1:m',
        entity: () => SessionEntity?.name ?? Session.name,
        mappedBy: (session) => session.user,
      },
    },
  });
};
