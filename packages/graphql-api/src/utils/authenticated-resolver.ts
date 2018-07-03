import { AccountsServer } from '@accounts/server';

export const authenticated = (Accounts: AccountsServer, func: any) => async (
  root: any,
  args: any,
  context: any,
  info: any
) => {
  if (context && context.skipJSAccountsVerification === true) {
    return func(root, args, context, info);
  }

  const authToken = context.authToken;

  if (!authToken || authToken === '' || authToken === null) {
    throw new Error('Unable to find authorization token in request');
  }

  const userObject = await Accounts.resumeSession(authToken);

  if (userObject === null) {
    throw new Error('Invalid or expired token!');
  }

  context.user = userObject;

  return func(root, args, context, info);
};
