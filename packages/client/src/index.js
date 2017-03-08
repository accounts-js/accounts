// @flow
import type { TokenStorage } from './config';
import type { TransportInterface } from './TransportInterface';

import Accounts, { AccountsClient } from './AccountsClient';
import config from './config';
import reducer from './module';

export default Accounts;

export {
  AccountsClient,
  config,
  reducer,
};

export type {
  TransportInterface,
  TokenStorage,
};
