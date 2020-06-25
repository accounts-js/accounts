import 'reflect-metadata';
import {
  UserCtorArgs as AccountsUserCtorArgs,
  Email,
  EmailCtorArgs,
  getEmailSchema,
  getServiceSchema,
  getSessionSchema,
  Session,
  Service,
} from '@accounts/mikro-orm';
import { ReflectMetadataProvider, Entity, Property } from 'mikro-orm';
import { UserCtor, getUserCtor, getUserSchema } from '@accounts/mikro-orm/lib/entity/User';

type ExtendedEmailCtorArgs = EmailCtorArgs<User> & {
  fullName?: string;
};

@Entity()
export class ExtendedEmail extends Email<User> {
  @Property({ nullable: true })
  fullName?: string;

  constructor({ fullName, ...otherProps }: ExtendedEmailCtorArgs) {
    super(otherProps);
    if (fullName) {
      this.fullName = fullName;
    }
  }
}

type UserCtorArgs = AccountsUserCtorArgs & {
  profile: {
    firstName: string;
    lastName: string;
  };
};

const AccountsUser: UserCtor<ExtendedEmail, Session<any>, Service<any>, UserCtorArgs> = getUserCtor(
  {
    abstract: true,
    EmailEntity: ExtendedEmail,
    getCustomEmailArgs: ({ profile: { firstName, lastName } }: UserCtorArgs) => ({
      fullName: `${firstName} ${lastName}`,
    }),
  }
);

@Entity()
export class User extends AccountsUser {
  @Property({ nullable: true })
  name?: string;

  @Property({ nullable: true })
  surname?: string;

  constructor(args: UserCtorArgs) {
    super(args);
    const {
      profile: { firstName, lastName },
    } = args;
    if (firstName) {
      this.name = firstName;
    }
    if (lastName) {
      this.surname = lastName;
    }
  }
}

export default {
  metadataProvider: ReflectMetadataProvider,
  cache: { enabled: false },
  entities: [
    User,
    getUserSchema({ User: AccountsUser, EmailEntity: ExtendedEmail, abstract: true }),
    ExtendedEmail,
    getEmailSchema({ UserEntity: User, abstract: true }),
    getServiceSchema({ UserEntity: User }),
    getSessionSchema({ UserEntity: User }),
  ],
  dbName: 'accounts',
  user: 'postgres',
  password: 'very-secret',
  type: 'postgresql' as const,
  forceUtcTimezone: true,
  debug: true,
};
