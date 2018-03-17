import { AccountsServer } from './accounts-server';
import * as encryption from './utils/encryption';
import { generateRandomToken } from './utils/tokens';
import { getFirstUserEmail } from './utils/get-first-user-email';

export default AccountsServer;
export {
  AccountsServer,
  encryption,
  generateRandomToken,
  getFirstUserEmail
};
