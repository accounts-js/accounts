import { AccountsServer } from './AccountsServer';
import * as encryption from './utils/encryption';
import { generateRandomToken } from './utils/tokens';
import { getFirstUserEmail } from './utils/getFirstUserEmail';

import { ConnectionInformationsType } from './types/ConnectionInformationsType'
import { AuthService } from './types/AuthService'
import { DBInterface } from './types/DBInterface'

export default AccountsServer;
export {
  AccountsServer,
  AuthService,
  encryption,
  DBInterface,
  generateRandomToken,
  ConnectionInformationsType,
  getFirstUserEmail
};
