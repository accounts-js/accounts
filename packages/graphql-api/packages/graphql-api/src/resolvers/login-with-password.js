export const loginWithPassword = Accounts =>
  (async (_, { user, password }) =>
    await Accounts.loginWithPassword(user, password));
