import { InjectionToken } from 'graphql-modules';
import { AccountsServerOptions } from './accounts-server-options';

export const AccountsCoreConfigToken = new InjectionToken<AccountsServerOptions>(
  'AccountsCoreConfig'
);
