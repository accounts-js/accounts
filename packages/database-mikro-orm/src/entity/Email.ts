import { IdentifiedReference, Reference, EntitySchema } from 'mikro-orm';
import { IUser, UserCtor, UserCtorArgs } from './User';
import { Session } from './Session';
import { Service } from './Service';

export class Email<CustomUser extends IUser<any, any, any>> {
  id!: number;

  user!: IdentifiedReference<CustomUser>;

  address: string;

  verified = false;

  constructor({ address, user, verified }: EmailCtorArgs<CustomUser>) {
    this.address = address.toLocaleLowerCase();
    if (user) {
      this.user = Reference.create(user);
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

export type EmailCtor<CustomUser extends IUser<any, any, any>> = new (
  args: EmailCtorArgs<CustomUser>
) => Email<CustomUser>;

export const getEmailSchema = <
  CustomEmail extends Email<any>,
  CustomSession extends Session<any>,
  CustomService extends Service<any>,
  CustomUserCtorArgs extends UserCtorArgs
>({
  UserEntity,
  abstract = false,
}: {
  UserEntity?: UserCtor<CustomEmail, CustomSession, CustomService, CustomUserCtorArgs>;
  abstract?: boolean;
} = {}) => {
  return new EntitySchema<Email<any>>({
    class: Email,
    abstract,
    properties: {
      id: { type: 'number', primary: true },
      user: { reference: 'm:1', wrappedReference: true, type: UserEntity?.name ?? 'User' },
      address: { type: 'string' },
      verified: { type: 'boolean', default: false, onCreate: () => false },
    },
  });
};
