export const newAccessToken = Accounts => (async (_, { refreshToken, accessToken }) => {
  const result = await Accounts.refreshTokens(accessToken, refreshToken);
  const tokens = result.tokens;

  return {
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
  };
});
