export const impersonate = Accounts =>
  (async (_, { accessToken, username }, context) => {
    const result = await await Accounts.impersonate(accessToken, username);

    if (result && result.user) {
      context.user = result.user;
      context.authToken = result.tokens.accessToken;
    }

    return result;
  });
