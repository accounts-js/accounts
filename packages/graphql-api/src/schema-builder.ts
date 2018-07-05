import { AccountsServer } from '@accounts/server';

import { refreshAccessToken } from './resolvers/refresh-tokens';
import { impersonate } from './resolvers/impersonate';
import { getUser } from './resolvers/get-user';
import { User } from './resolvers/user';
import { mutations } from './graphql/mutations';
import { typeDefs as accountsTypeDefs } from './graphql/types';
import { queries } from './graphql/queries';
import { logout } from './resolvers/logout';
import { registerPassword } from './resolvers/register-user';
import { resetPassword } from './resolvers/reset-password';
import { sendResetPasswordEmail } from './resolvers/send-reset-password-email';
import { verifyEmail, sendVerificationEmail } from './resolvers/verify-email';
import { serviceAuthenticate } from './resolvers/authenticate';
import { changePassword } from './resolvers/change-password';
import { twoFactorSet, twoFactorUnset, twoFactorSecret } from './resolvers/two-factor';
import { authenticated } from './utils/authenticated-resolver';
import { MutationResolvers, QueryResolvers } from './types/graphql';
import { createAuthenticatedDirective } from './utils/authenticated-directive';

export interface SchemaGenerationOptions {
  rootQueryName?: string;
  rootMutationName?: string;
  extend?: boolean;
  withSchemaDefinition?: boolean;
}

const defaultSchemaOptions = {
  rootQueryName: 'Query',
  rootMutationName: 'Mutation',
  extend: true,
  withSchemaDefinition: false,
};

export const createJSAccountsGraphQL = (
  accountsServer: AccountsServer,
  schemaOptionsUser?: SchemaGenerationOptions
) => {
  const schemaOptions = {
    ...defaultSchemaOptions,
    ...schemaOptionsUser,
  };

  const typeDefs = `
  ${accountsTypeDefs}

  ${schemaOptions.extend ? 'extend ' : ''}type ${schemaOptions.rootQueryName} {
    ${queries}
  }

  ${schemaOptions.extend ? 'extend ' : ''}type ${schemaOptions.rootMutationName} {
    ${mutations}
  }

  ${
    schemaOptions.withSchemaDefinition
      ? `schema {
    query: ${schemaOptions.rootMutationName}
    mutation: ${schemaOptions.rootQueryName}
  }`
      : ''
  }
  `;

  const queryResolvers: QueryResolvers.Resolvers = {
    getUser: getUser(accountsServer),
    twoFactorSecret: authenticated(accountsServer, twoFactorSecret(accountsServer)),
  };

  const mutationResolvers: MutationResolvers.Resolvers = {
    impersonate: impersonate(accountsServer),
    refreshTokens: refreshAccessToken(accountsServer),
    logout: logout(accountsServer),
    // 3rd-party services authentication
    authenticate: serviceAuthenticate(accountsServer),

    // @accounts/password
    register: registerPassword(accountsServer),
    verifyEmail: verifyEmail(accountsServer),
    resetPassword: resetPassword(accountsServer),
    sendVerificationEmail: sendVerificationEmail(accountsServer),
    sendResetPasswordEmail: sendResetPasswordEmail(accountsServer),
    changePassword: authenticated(accountsServer, changePassword(accountsServer)),

    // Two factor
    twoFactorSet: authenticated(accountsServer, twoFactorSet(accountsServer)),
    twoFactorUnset: authenticated(accountsServer, twoFactorUnset(accountsServer)),

    // TODO: OAuth callback endpoint
  };

  const resolvers = {
    User,
    [schemaOptions.rootMutationName]: mutationResolvers,
    [schemaOptions.rootQueryName]: queryResolvers,
  };

  return {
    typeDefs,
    resolvers,
    schemaDirectives: {
      authenticated: createAuthenticatedDirective(accountsServer),
    },
  };
};
