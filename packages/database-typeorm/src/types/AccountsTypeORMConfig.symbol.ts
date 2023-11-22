import { InjectionToken } from 'graphql-modules';
import { type AccountsTypeormOptions } from '.';

export const AccountsTypeORMConfigToken = new InjectionToken<AccountsTypeormOptions>(
  'AccountsTypeORMConfigToken'
);
