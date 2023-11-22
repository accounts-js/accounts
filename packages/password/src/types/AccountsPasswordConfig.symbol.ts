import { InjectionToken } from 'graphql-modules';
import { type AccountsPasswordOptions } from '../accounts-password';

export const AccountsPasswordConfigToken = new InjectionToken<AccountsPasswordOptions>(
  'AccountsPasswordConfig'
);
