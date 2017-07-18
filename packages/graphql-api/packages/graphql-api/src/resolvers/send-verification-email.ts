export const sendVerificationEmail = Accounts =>
  (async (_, { email }) =>
    await Accounts.sendVerificationEmail(email));
