import { Collection, EntitySchema } from '@mikro-orm/core';
import { Service, type ServiceCtor, type ServiceCtorArgs } from './Service';
import { Email, type EmailCtor, type EmailCtorArgs } from './Email';
import { Session, type SessionCtor } from './Session';

export interface IUser<
  CustomEmail extends Email<any>,
  CustomSession extends Session<any>,
  CustomService extends Service<any>,
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
  CustomUserCtorArgs extends UserCtorArgs = UserCtorArgs,
  CustomEmailCtorArgs extends EmailCtorArgs<any> = EmailCtorArgs<any>,
  CustomServiceCtorArgs extends ServiceCtorArgs<any> = ServiceCtorArgs<any>,
>({
  abstract = false,
  EmailEntity = Email as new (args: CustomEmailCtorArgs) => CustomEmail,
  ServiceEntity = Service as new (args: CustomServiceCtorArgs) => CustomService,
  getCustomEmailArgs = () => ({}),
  getCustomServiceArgs = () => ({}),
}: {
  abstract?: boolean;
  EmailEntity?: new (args: CustomEmailCtorArgs) => CustomEmail;
  ServiceEntity?: new (args: CustomServiceCtorArgs) => CustomService;
  getCustomEmailArgs?: (args: CustomUserCtorArgs) => Partial<CustomEmailCtorArgs>;
  getCustomServiceArgs?: (args: CustomUserCtorArgs) => Partial<CustomServiceCtorArgs>;
} = {}) => {
  class User implements IUser<CustomEmail, CustomSession, CustomService> {
    id!: number;
    username?: string;
    services = new Collection<CustomService>(this);
    emails = new Collection<CustomEmail>(this);
    sessions = new Collection<CustomSession>(this);
    deactivated = false;
    createdAt = new Date();
    updatedAt = new Date();

    constructor(args: CustomUserCtorArgs) {
      const { email, password, username } = args;
      if (username) {
        this.username = username;
      }
      if (email) {
        this.emails.add(
          new EmailEntity({ address: email, ...getCustomEmailArgs(args) } as CustomEmailCtorArgs)
        );
      }
      if (password) {
        this.services.add(
          new ServiceEntity({
            name: 'password',
            password,
            ...getCustomServiceArgs(args),
          } as CustomServiceCtorArgs)
        );
      }
    }
  }
  if (abstract) {
    Object.defineProperty(User, 'name', { value: 'AccountsUser' });
  }
  return User as UserCtor<CustomEmail, CustomSession, CustomService, UserCtorArgs>;
};

export interface UserCtorArgs {
  email?: string;
  password?: string;
  username?: string;
}

export type UserCtor<
  CustomEmail extends Email<any>,
  CustomSession extends Session<any>,
  CustomService extends Service<any>,
  CustomUserCtorArgs extends UserCtorArgs = UserCtorArgs,
> = new (args: CustomUserCtorArgs) => IUser<CustomEmail, CustomSession, CustomService>;

export const getUserSchema = ({
  AccountsUser,
  EmailEntity = Email,
  SessionEntity = Session,
  ServiceEntity = Service,
  abstract = false,
}: {
  AccountsUser: UserCtor<any, any, any, any>;
  EmailEntity?: EmailCtor<any, any>;
  SessionEntity?: SessionCtor<any, any>;
  ServiceEntity?: ServiceCtor<any, any>;
  abstract?: boolean;
}) => {
  if (abstract) {
    Object.defineProperty(AccountsUser, 'name', { value: 'AccountsUser' });
  }
  return new EntitySchema<InstanceType<typeof AccountsUser>>({
    class: AccountsUser,
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
        kind: '1:m',
        entity: () => ServiceEntity?.name ?? Service.name,
        mappedBy: (service: InstanceType<typeof ServiceEntity>) => service.user,
      },
      emails: {
        kind: '1:m',
        entity: () => EmailEntity?.name ?? Email.name,
        mappedBy: (email: InstanceType<typeof EmailEntity>) => email.user,
      },
      sessions: {
        kind: '1:m',
        entity: () => SessionEntity?.name ?? Session.name,
        mappedBy: (session: InstanceType<typeof SessionEntity>) => session.user,
      },
    },
  });
};
