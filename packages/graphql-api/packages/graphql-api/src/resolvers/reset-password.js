export const resetPassword = Accounts =>
  (async (_, { token, newPassword }) =>
    await Accounts.resetPassword(token, newPassword));
