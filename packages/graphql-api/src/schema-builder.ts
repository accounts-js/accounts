import { AccountsServer } from '@accounts/server';
import { AccountsPassword } from '@accounts/password';

import { refreshAccessToken } from './resolvers/refresh-tokens';
import { impersonate } from './resolvers/impersonate';
import { getUser } from './resolvers/get-user';
import { mutations, mutationsPassword } from './graphql/mutations';
import {
  typeDefs as accountsTypeDefs,
  typeDefsPassword as accountsTypePassword,
} from './graphql/types';
import { queries, queriesPassword } from './graphql/queries';
import { logout } from './resolvers/logout';
import { createUser } from './resolvers/create-user';
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

export const createAccountsGraphQL = (
  accountsServer: AccountsServer,
  schemaOptionsUser?: SchemaGenerationOptions
) => {
  const passwordService = accountsServer.getServices().password as AccountsPassword | undefined;

  const schemaOptions = {
    ...defaultSchemaOptions,
    ...schemaOptionsUser,
  };

  const typeDefs = `
  ${accountsTypeDefs}
  ${passwordService ? accountsTypePassword : ''}

  ${schemaOptions.extend ? 'extend ' : ''}type ${schemaOptions.rootQueryName} {
    ${queries}
    ${passwordService ? queriesPassword : ''}
  }

  ${schemaOptions.extend ? 'extend ' : ''}type ${schemaOptions.rootMutationName} {
    ${mutations}
    ${passwordService ? mutationsPassword : ''}
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

  let queryResolvers: QueryResolvers.Resolvers = {
    getUser: getUser(accountsServer),
  };

  if (passwordService) {
    queryResolvers = {
      ...queryResolvers,
      twoFactorSecret: authenticated(twoFactorSecret(accountsServer)),
    };
  }

  let mutationResolvers: MutationResolvers.Resolvers = {
    impersonate: impersonate(accountsServer),
    refreshTokens: refreshAccessToken(accountsServer),
    logout: logout(accountsServer),
    // 3rd-party services authentication
    authenticate: serviceAuthenticate(accountsServer),
    // TODO: OAuth callback endpoint
  };

  if (passwordService) {
    mutationResolvers = {
      ...mutationResolvers,
      createUser: createUser(accountsServer),
      verifyEmail: verifyEmail(accountsServer),
      resetPassword: resetPassword(accountsServer),
      sendVerificationEmail: sendVerificationEmail(accountsServer),
      sendResetPasswordEmail: sendResetPasswordEmail(accountsServer),
      changePassword: authenticated(changePassword(accountsServer)),

      // Two factor
      twoFactorSet: authenticated(twoFactorSet(accountsServer)),
      twoFactorUnset: authenticated(twoFactorUnset(accountsServer)),
    };
  }

  const resolvers = {
    [schemaOptions.rootMutationName]: mutationResolvers,
    [schemaOptions.rootQueryName]: queryResolvers,
  };

  return {
    typeDefs,
    resolvers,
    schemaDirectives: {
      auth: createAuthenticatedDirective(accountsServer),
    },
  };
};
