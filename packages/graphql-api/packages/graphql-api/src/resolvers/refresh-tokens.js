export const refreshTokens = Accounts =>
  (async (_, { accessToken, refreshToken }) =>
    await Accounts.refreshTokens(accessToken, refreshToken));
