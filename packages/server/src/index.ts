import Accounts, { AccountsServer } from './accounts-server';
import * as encryption from './encryption';
import { DBInterface } from './db-interface';
import config from './config';

export default Accounts;

export {
  AccountsServer,
  encryption,
  config,
  DBInterface,
};
