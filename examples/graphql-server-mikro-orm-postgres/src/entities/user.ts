import 'reflect-metadata';
import {
  UserCtorArgs as AccountsUserCtorArgs,
  Session,
  Service,
  ServiceCtorArgs,
  UserCtor,
  getUserCtor,
} from '@accounts/mikro-orm';
import { Entity, Property } from '@mikro-orm/core';
import type { Email, EmailCtorArgs } from './email';
import { Email as EmailEntity } from './email';

type UserCtorArgs = AccountsUserCtorArgs & {
  firstName: string;
  lastName: string;
};

export const AccountsUser: UserCtor<
  Email,
  Session<User>,
  Service<User>,
  UserCtorArgs
> = getUserCtor<
  Email,
  Session<User>,
  Service<User>,
  UserCtorArgs,
  EmailCtorArgs,
  ServiceCtorArgs<User>
>({
  abstract: true,
  EmailEntity,
  getCustomEmailArgs: ({ firstName, lastName }) => ({
    fullName: `${firstName} ${lastName}`,
  }),
});

@Entity()
export class User extends AccountsUser {
  @Property({ nullable: true })
  firstName?: string;

  @Property({ nullable: true })
  lastName?: string;

  constructor(args: UserCtorArgs) {
    super(args);
    const { firstName, lastName } = args;
    if (firstName) {
      this.firstName = firstName;
    }
    if (lastName) {
      this.lastName = lastName;
    }
  }
}
