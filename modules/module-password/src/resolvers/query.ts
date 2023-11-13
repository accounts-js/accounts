import { GraphQLError } from 'graphql';
import { QueryResolvers } from '../models';
import { AccountsPassword } from '@accounts/password';

export const Query: QueryResolvers = {
  twoFactorSecret: async (_, args, ctx) => {
    const { user, injector } = ctx;

    // Make sure user is logged in
    if (!(user && user.id)) {
      throw new GraphQLError('Unauthorized', {
        extensions: {
          code: 'UNAUTHENTICATED',
          http: { status: 401 },
        },
      });
    }

    // https://github.com/speakeasyjs/speakeasy/blob/master/index.js#L517
    const secret = injector.get(AccountsPassword).twoFactor.getNewAuthSecret();
    return secret;
  },
};
