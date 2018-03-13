import { AccountsServer } from './accounts-server';
import * as encryption from './utils/encryption';
import { generateRandomToken } from './utils/tokens';
import { getFirstUserEmail } from './utils/get-first-user-email';

import { ConnectionInformationsType } from './types/connection-informations-type';
import { AuthService } from './types/auth-service';
import { DBInterface } from './types/db-interface';

export default AccountsServer;
export {
  AccountsServer,
  AuthService,
  encryption,
  DBInterface,
  generateRandomToken,
  ConnectionInformationsType,
  getFirstUserEmail,
};
