export const loginWithPassword = Accounts =>
  (async (_, { user, userFields, password }, context) => {
    let loginFields = userFields;

    if (user && user !== '') {
      loginFields = {
        username: user,
      };
    }

    const loginResult = await Accounts.loginWithPassword(loginFields, password);

    if (loginResult && loginResult.user) {
      context.user = loginResult.user;
    }

    return loginResult;
  });

