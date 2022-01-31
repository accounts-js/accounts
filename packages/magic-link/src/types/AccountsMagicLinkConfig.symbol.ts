import { InjectionToken } from 'graphql-modules';
import { AccountsMagicLinkOptions } from '../accounts-magic-link';

export const AccountsMagicLinkConfigToken = new InjectionToken<AccountsMagicLinkOptions>(
  'AccountsMagicLinkConfig'
);
