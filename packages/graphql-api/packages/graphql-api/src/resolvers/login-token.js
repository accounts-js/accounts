export const loginToken = Accounts => (async (_, { user }) => {
  const identificationField = user.username || user.email;
  const loginResult = await Accounts.loginWithPassword(identificationField, user.password);
  const tokens = loginResult.tokens;

  return {
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
  };
});
