import 'reflect-metadata';
import {
  EmailCtor,
  EmailCtorArgs as AccountsEmailCtorArgs,
  getEmailCtor,
} from '@accounts/mikro-orm';
import { Entity, Property } from '@mikro-orm/core';
import { User } from './user';

export type EmailCtorArgs = AccountsEmailCtorArgs<User> & {
  fullName: string;
};

const AccountsEmail: EmailCtor<User> = getEmailCtor<User>({ abstract: true });

@Entity()
export class Email extends AccountsEmail {
  @Property()
  fullName: string;

  constructor({ fullName, ...otherProps }: EmailCtorArgs) {
    super(otherProps);
    this.fullName = fullName;
  }
}
