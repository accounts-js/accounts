export const impersonate = Accounts =>
  (async (_, { accessToken, username }) =>
    await Accounts.impersonate(accessToken, username));
