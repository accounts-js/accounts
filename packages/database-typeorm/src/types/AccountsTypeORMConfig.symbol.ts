import { InjectionToken } from 'graphql-modules';
import { AccountsTypeormOptions } from '.';

export const AccountsTypeORMConfigToken = new InjectionToken<AccountsTypeormOptions>(
  'AccountsTypeORMConfigToken'
);
