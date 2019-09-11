export const LoginResult = {};

export const LoginWithServiceResult = {
  __resolveType(obj: any) {
    if (obj.tokens) {
      return 'LoginResult';
    }

    return 'MFALoginResult';
  },
};
