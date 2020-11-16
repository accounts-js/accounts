import { Resolvers } from '../../../models';

export const resolvers: Resolvers = {
  AuthenticationResult: {
    __resolveType(obj) {
      if ('sessionId' in obj) {
        return 'LoginResult';
      }
      if ('mfaToken' in obj) {
        return 'MultiFactorResult';
      }
      return null;
    },
  },
};
