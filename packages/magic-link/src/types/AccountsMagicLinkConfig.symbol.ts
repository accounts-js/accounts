import { InjectionToken } from 'graphql-modules';
import { type AccountsMagicLinkOptions } from '../accounts-magic-link';

export const AccountsMagicLinkConfigToken = new InjectionToken<AccountsMagicLinkOptions>(
  'AccountsMagicLinkConfig'
);
