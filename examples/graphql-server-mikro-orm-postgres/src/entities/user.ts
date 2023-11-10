import 'reflect-metadata';
import {
  UserCtorArgs as AccountsUserCtorArgs,
  Session,
  Service,
  UserCtor,
  getUserCtor,
} from '@accounts/mikro-orm';
import { Entity, Property } from '@mikro-orm/core';
import { Email, EmailCtorArgs } from './email';

type UserCtorArgs = AccountsUserCtorArgs & {
  firstName: string;
  lastName?: string;
};

export const AccountsUser: UserCtor<Email, Session<User>, Service<User>> = getUserCtor<
  Email,
  Session<User>,
  Service<User>,
  UserCtorArgs,
  EmailCtorArgs
>({
  abstract: true,
  EmailEntity: Email,
  getCustomEmailArgs: ({ firstName, lastName }) => ({
    fullName: `${firstName} ${lastName}`,
  }),
});

@Entity()
export class User extends AccountsUser {
  @Property()
  firstName: string;

  @Property({ nullable: true })
  lastName?: string;

  constructor({ firstName, lastName, ...otherProps }: UserCtorArgs) {
    super(otherProps);
    this.firstName = firstName;
    if (lastName) {
      this.lastName = lastName;
    }
  }
}
