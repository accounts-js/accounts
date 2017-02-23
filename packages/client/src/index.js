// @flow

import Accounts, { AccountsClient } from './AccountsClient';
import type { TransportInterface } from './TransportInterface';
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
};
