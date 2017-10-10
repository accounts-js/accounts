import { loginWithPassword } from './resolvers/login-with-password';
import { refreshTokens } from './resolvers/refresh-tokens';
import { impersonate } from './resolvers/impersonate';
import { me } from './resolvers/me';
import { User } from './resolvers/user';
import { mutations } from './graphql/mutations';
import { typeDefs } from './graphql/types';
import { queries } from './graphql/queries';
import { logout } from './resolvers/logout';
import { createUser } from './resolvers/create-user';
import { resetPassword } from './resolvers/reset-password';
import { sendResetPasswordEmail } from './resolvers/send-reset-password-email';
import { sendVerificationEmail } from './resolvers/send-verification-email';
import { verifyEmail } from './resolvers/verify-email';
import * as merge from 'deepmerge';

export interface SchemaGenerationOptions {
  rootQueryName: string;
  rootMutationName: string;
  extend: boolean;
  withSchemaDefinition: boolean;
}

export const createJSAccountsGraphQL = (Accounts: any, schemaOptions: SchemaGenerationOptions = {
  rootQueryName: 'Query',
  rootMutationName: 'Mutation',
  extend: true,
  withSchemaDefinition: false,
}) => {
  const schema = `
  ${typeDefs}

  ${schemaOptions.extend ? 'extend ' : ''}type ${schemaOptions.rootQueryName} {
    ${queries}
  }

  ${schemaOptions.extend ? 'extend ' : ''}type ${schemaOptions.rootMutationName} {
    ${mutations}
  }

  ${schemaOptions.withSchemaDefinition ?
    `schema {
    query: ${schemaOptions.rootMutationName}
    mutation: ${schemaOptions.rootQueryName}
  }` : ''}
  `;

  const resolvers = {
    User,
    [schemaOptions.rootMutationName]: {
      loginWithPassword: loginWithPassword(Accounts),
      refreshTokens: refreshTokens(Accounts),
      logout: logout(Accounts),
      impersonate: impersonate(Accounts),
      createUser: createUser(Accounts),
      resetPassword: resetPassword(Accounts),
      sendResetPasswordEmail: sendResetPasswordEmail(Accounts),
      sendVerificationEmail: sendVerificationEmail(Accounts),
      verifyEmail: verifyEmail(Accounts),
    },
    [schemaOptions.rootQueryName]: {
      me: me(Accounts),
    },
  };

  return {
    schema,
    extendWithResolvers: resolversObject => merge(resolvers, resolversObject),
  };
};
