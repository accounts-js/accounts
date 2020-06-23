import { Collection, EntitySchema } from 'mikro-orm';
import { Service, ServiceCtor, ServiceCtorArgs } from './Service';
import { Email, EmailCtor, EmailCtorArgs } from './Email';
import { Session, SessionCtor } from './Session';

export interface IUser<
  CustomEmail extends Email<any>,
  CustomSession extends Session<any>,
  CustomService extends Service<any>
> {
  id: number;
  username?: string;
  services: Collection<CustomService>;
  emails: Collection<CustomEmail>;
  sessions: Collection<CustomSession>;
  deactivated: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const getUserCtor = <
  CustomEmail extends Email<any>,
  CustomSession extends Session<any>,
  CustomService extends Service<any>,
  CustomEmailCtorArgs extends EmailCtorArgs<any>,
  CustomServiceCtorArgs extends ServiceCtorArgs<any>
>({
  EmailEntity = Email,
  ServiceEntity = Service,
  getCustomEmailArgs = () => ({}),
  getCustomServiceArgs = () => ({}),
}: {
  EmailEntity?: EmailCtor<any>;
  ServiceEntity?: ServiceCtor<any>;
  getCustomEmailArgs?: (args: UserCtorArgs & Partial<CustomEmailCtorArgs>) => Record<string, any>;
  getCustomServiceArgs?: (
    args: UserCtorArgs & Partial<CustomServiceCtorArgs>
  ) => Record<string, any>;
} = {}) =>
  class User implements IUser<CustomEmail, CustomSession, CustomService> {
    id!: number;
    username?: string;
    services = new Collection<CustomService>(this);
    emails = new Collection<CustomEmail>(this);
    sessions = new Collection<CustomSession>(this);
    deactivated = false;
    createdAt = new Date();
    updatedAt = new Date();

    constructor(
      args: UserCtorArgs &
        ReturnType<typeof getCustomEmailArgs> &
        ReturnType<typeof getCustomServiceArgs>
    ) {
      const { email, password, username } = args;
      if (username) {
        this.username = username;
      }
      if (email) {
        this.emails.add(
          new EmailEntity({ address: email, ...getCustomEmailArgs(args) }) as CustomEmail
        );
      }
      if (password) {
        this.services.add(
          new ServiceEntity({
            name: 'password',
            password,
            ...getCustomServiceArgs(args),
          }) as CustomService
        );
      }
    }
  };

export interface UserCtorArgs {
  email?: string;
  password?: string;
  username?: string;
}

export type UserCtor<
  CustomEmail extends Email<any> = any,
  CustomSession extends Session<any> = any,
  CustomService extends Service<any> = any,
  CustomUserCtorArgs extends UserCtorArgs = UserCtorArgs
> = new (args: CustomUserCtorArgs) => IUser<CustomEmail, CustomSession, CustomService>;

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
  const UserClass = getUserCtor({ EmailEntity, ServiceEntity });
  const schema = new EntitySchema<IUser<any, any, any>>({
    class: UserClass,
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
  return { ctor: UserClass, schema };
};
