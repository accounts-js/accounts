import { InjectionToken } from 'graphql-modules';
import { AccountsPasswordOptions } from '../accounts-password';

export const AccountsPasswordConfigToken = new InjectionToken<AccountsPasswordOptions>(
  'AccountsPasswordConfig'
);
