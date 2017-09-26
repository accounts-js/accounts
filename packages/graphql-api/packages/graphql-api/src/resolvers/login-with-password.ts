export const loginWithPassword = Accounts =>
  (async (_, { user, userFields, password }) => {
    let loginFields = userFields;

    if (user && user !== '') {
      loginFields = {
        username: user,
      };
    }

    return await Accounts.loginWithPassword(loginFields, password);
  });

