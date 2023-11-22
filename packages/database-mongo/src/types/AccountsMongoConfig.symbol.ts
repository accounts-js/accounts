import { InjectionToken } from 'graphql-modules';
import { type AccountsMongoOptions } from './accounts-mongo-options';

export const AccountsMongoConfigToken = new InjectionToken<AccountsMongoOptions>(
  'AccountsMongoConfig'
);
