// @flow

import Accounts, { AccountsClient } from './AccountsClient';
import type { TransportInterface } from './TransportInterface';
import config from './config';

export default Accounts;

export {
  AccountsClient,
  config,
};

export type {
  TransportInterface,
};
