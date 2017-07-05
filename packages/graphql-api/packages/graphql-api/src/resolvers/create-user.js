export const createUser = Accounts =>
  (async (_, { user }) =>
    await Accounts.createUser(user));
