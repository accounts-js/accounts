export const impersonate = Accounts =>
  (async (_, { accessToken, user }) =>
    await Accounts.impersonate(accessToken, user));
