export const sendResetPasswordEmail = Accounts =>
  (async (_, { email }) =>
    await Accounts.sendResetPasswordEmail(email));
