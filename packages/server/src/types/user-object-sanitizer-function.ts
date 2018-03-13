import { UserObjectType } from '@accounts/common';

export type UserObjectSanitizerFunction = (
  userObject: UserObjectType,
  omitFunction: (userDoc: object, fields: string[]) => UserObjectType,
  pickFunction: (userDoc: object, fields: string[]) => UserObjectType
) => any;
