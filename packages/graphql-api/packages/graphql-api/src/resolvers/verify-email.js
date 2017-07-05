export const verifyEmail = Accounts =>
  (async (_, { token }) =>
    await Accounts.verifyEmail(token));
