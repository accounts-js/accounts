export const logout = Accounts =>
  (async (_, { accessToken }) =>
    await Accounts.logout(accessToken));
