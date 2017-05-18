// @flow
import type { TokenStorage } from './config';
import type { TransportInterface } from './TransportInterface';

import { AccountsClient } from './AccountsClient';
import config from './config';
import reducer from './module';
import validate from './validate';

export default AccountsClient;

export {
  AccountsClient,
  config,
  reducer,
  validate,
};

export type {
  TransportInterface,
  TokenStorage,
};
