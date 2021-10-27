import 'reflect-metadata';
import { EmailCtorArgs as AccountsEmailCtorArgs, getEmailCtor } from '@accounts/mikro-orm';
import { Entity, Property } from '@mikro-orm/core';
import type { User } from './user';

const AccountsEmail = getEmailCtor<User>({ abstract: true });

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
