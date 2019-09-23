import {
  LoginWithServiceResultResolvers,
  LoginResult as GeneratedLoginResult,
  MfaLoginResult as GeneratedMfaLoginResult,
} from '../../../models';

export const LoginResult = {};

export const LoginWithServiceResult: LoginWithServiceResultResolvers = {
  __resolveType(obj: GeneratedLoginResult | GeneratedMfaLoginResult) {
    if ((obj as GeneratedLoginResult).tokens) {
      return 'LoginResult';
    }

    return 'MFALoginResult';
  },
};
