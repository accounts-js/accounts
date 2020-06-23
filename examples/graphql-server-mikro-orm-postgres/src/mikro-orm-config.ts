import 'reflect-metadata';
import {
  getUserCtor,
  UserCtorArgs,
  getUserSchema,
  Email,
  EmailCtorArgs,
  getEmailSchema,
  getServiceSchema,
  getSessionSchema,
} from '@accounts/mikro-orm';
import { ReflectMetadataProvider, Entity, Property } from 'mikro-orm';
import { UserCtor } from '@accounts/mikro-orm/lib/entity/User';

type ExtendedEmailCtorArgs = EmailCtorArgs<ExtendedUser> & {
  fullName?: string;
};

@Entity()
export class ExtendedEmail extends Email<ExtendedUser> {
  @Property({ nullable: true })
  fullName?: string;

  constructor({ fullName, ...otherProps }: ExtendedEmailCtorArgs) {
    super(otherProps);
    if (fullName) {
      this.fullName = fullName;
    }
  }
}

type ExtendedUserCtorArgs = UserCtorArgs & {
  profile: {
    firstName: string;
    lastName: string;
  };
};

const User: UserCtor<ExtendedEmail, any, any, ExtendedUserCtorArgs> = getUserCtor({
  EmailEntity: ExtendedEmail,
  getCustomEmailArgs: ({ profile: { firstName, lastName } }: ExtendedUserCtorArgs) => ({
    fullName: `${firstName} ${lastName}`,
  }),
});

@Entity()
export class ExtendedUser extends User {
  @Property({ nullable: true })
  name?: string;

  @Property({ nullable: true })
  surname?: string;

  constructor(args: ExtendedUserCtorArgs) {
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
    ExtendedUser,
    getUserSchema({ EmailEntity: ExtendedEmail, abstract: true }),
    ExtendedEmail,
    getEmailSchema({ UserEntity: ExtendedUser, abstract: true }),
    getServiceSchema({ UserEntity: ExtendedUser }),
    getSessionSchema({ UserEntity: ExtendedUser }),
  ],
  dbName: 'accounts',
  user: 'postgres',
  password: 'very-secret',
  type: 'postgresql' as const,
  forceUtcTimezone: true,
  debug: true,
};
