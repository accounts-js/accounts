export const refreshTokens = Accounts =>
  (async (_, { accessToken, refreshToken }, { context }) => {
    const result = await Accounts.refreshTokens(accessToken, refreshToken);

    if (result && result.user) {
      context.user = result.user;
    }

    return result;
  });
