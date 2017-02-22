import { authenticated } from '../utils/authenticated-resolver';

export const me = Accounts => authenticated(Accounts, (root, args, { user }) => user);
