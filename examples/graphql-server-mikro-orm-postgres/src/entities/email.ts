import 'reflect-metadata';
import {
  EmailCtor,
  EmailCtorArgs as AccountsEmailCtorArgs,
  getEmailCtor,
} from '@accounts/mikro-orm';
import { Entity, Property } from '@mikro-orm/core';
import { User } from './user';

const AccountsEmail: EmailCtor<User> = getEmailCtor<User>({ abstract: true });

export type EmailCtorArgs = AccountsEmailCtorArgs<User> & {
  fullName?: string;
};

@Entity()
export class Email extends AccountsEmail {
  @Property({ nullable: true })
  fullName?: string;

  constructor({ fullName, ...otherProps }: EmailCtorArgs) {
    super(otherProps);
    if (fullName) {
      this.fullName = fullName;
    }
  }
}
