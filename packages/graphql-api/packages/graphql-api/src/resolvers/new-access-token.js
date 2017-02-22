export const newAccessToken = (Accounts) => {
  return async (_, {refreshToken, accessToken}): Promise<any> => {
    const result = await Accounts.refreshTokens(accessToken, refreshToken);
    const tokens = result.tokens;

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken
    };
  };
};
