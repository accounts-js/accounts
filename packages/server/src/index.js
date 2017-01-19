/* eslint-disable import/no-named-as-default */
import Accounts, { AccountsServer } from './AccountsServer';
import * as encryption from './encryption';
import type { DBInterface } from './DBInterface';
import config from './config';

export default Accounts;

export {
  AccountsServer,
  encryption,
  config,
};

export type {
  DBInterface,
};
