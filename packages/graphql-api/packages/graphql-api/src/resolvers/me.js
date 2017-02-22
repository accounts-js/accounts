import { authenticated } from '../utils/authenticated-resolver';

export const me = (Accounts) => {
  return authenticated(Accounts, (root, args, { user }) => user);
};
