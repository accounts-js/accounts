export const authenticated = (Accounts, func) => (async (root, args, context, info) => {
  if (context && context.skipJSAccountsVerification === true) {
    return await func(root, args, context, info);
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

  return await func(root, args, context, info);
});
