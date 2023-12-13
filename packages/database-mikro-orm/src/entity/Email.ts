import { type Ref, EntitySchema, ref } from '@mikro-orm/core';
import { type IUser, type UserCtor } from './User';

export class Email<CustomUser extends IUser<any, any, any>> {
  id!: number;

  user!: Ref<CustomUser>;

  address: string;

  verified = false;

  constructor({ address, user, verified }: EmailCtorArgs<CustomUser>) {
    this.address = address.toLocaleLowerCase();
    if (user) {
      this.user = ref(user);
    }
    if (verified) {
      this.verified = verified;
    }
  }
}

export interface EmailCtorArgs<CustomUser extends IUser<any, any, any>> {
  address: string;
  user?: CustomUser;
  verified?: boolean;
}

export type EmailCtor<
  CustomUser extends IUser<any, any, any>,
  CustomEmailCtorArgs extends EmailCtorArgs<CustomUser> = EmailCtorArgs<CustomUser>,
> = new (args: CustomEmailCtorArgs) => Email<CustomUser>;

export const getEmailCtor = <
  CustomUser extends IUser<any, any, any>,
  CustomEmailCtorArgs extends EmailCtorArgs<CustomUser> = EmailCtorArgs<CustomUser>,
>({
  abstract = false,
}: {
  abstract?: boolean;
} = {}): EmailCtor<CustomUser, CustomEmailCtorArgs> => {
  if (abstract) {
    Object.defineProperty(Email, 'name', { value: 'AccountsEmail' });
  }
  return Email as EmailCtor<CustomUser, CustomEmailCtorArgs>;
};

export const getEmailSchema = ({
  UserEntity,
  abstract = false,
}: {
  UserEntity?: UserCtor<any, any, any, any>;
  abstract?: boolean;
} = {}) => {
  if (abstract) {
    Object.defineProperty(Email, 'name', { value: 'AccountsEmail' });
  }
  return new EntitySchema<Email<any>>({
    class: Email,
    abstract,
    properties: {
      id: { type: 'number', primary: true },
      user: { kind: 'm:1', ref: true, type: UserEntity?.name ?? 'User' },
      address: { type: 'string' },
      verified: { type: 'boolean', default: false, onCreate: () => false },
    },
  });
};
