import { User } from '@accounts/types';

export type UserObjectSanitizerFunction = (
  userObject: User,
  omitFunction: (userDoc: Record<string, unknown>, fields: string[]) => User,
  pickFunction: (userDoc: Record<string, unknown>, fields: string[]) => User
) => any;
