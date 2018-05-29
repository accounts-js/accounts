import { AccountsServer } from './accounts-server';
import * as encryption from './utils/encryption';
import { generateRandomToken } from './utils/tokens';
import { getFirstUserEmail } from './utils/get-first-user-email';
import { ServerHooks } from './utils/server-hooks';

export default AccountsServer;
export { AccountsServer, encryption, ServerHooks, generateRandomToken, getFirstUserEmail };
