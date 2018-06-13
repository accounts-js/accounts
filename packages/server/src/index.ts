import { AccountsServer } from './accounts-server';
import { generateRandomToken } from './utils/tokens';
import { getFirstUserEmail } from './utils/get-first-user-email';
import { ServerHooks } from './utils/server-hooks';

export default AccountsServer;
export { AccountsServer, ServerHooks, generateRandomToken, getFirstUserEmail };
