export const authenticated = (Accounts, func) => {
  return async(root, args, context, info): Promise<any> => {
    const authToken = context.authToken;

    if (!authToken || authToken === '' || authToken === null) {
      throw new Error('Unable to find authorization token in request');
    }

    const userObject = await Accounts.resumeSession(authToken);

    if (userObject === null) {
      throw new Error(`Invalid or expired token!`);
    }

    return await func(root, args, Object.assign(context, {user: userObject}), info);
  };
};
