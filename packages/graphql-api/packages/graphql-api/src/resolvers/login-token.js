export const loginToken = (Accounts) => {
  return async (_, {user}): Promise<any> => {
    const loginResult = await Accounts.loginWithPassword(user.username || user.email, user.password);
    const tokens = loginResult.tokens;

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken
    };
  };
};
