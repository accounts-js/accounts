// @flow
import { loginWithPassword } from './resolvers/login-with-password';
import { refreshTokens } from './resolvers/refresh-tokens';
import { impersonate } from './resolvers/impersonate';
import { me } from './resolvers/me';
import { User } from './resolvers/user';
import { mutations } from './graphql/mutations';
import { typeDefs } from './graphql/types';
import { queries } from './graphql/queries';
import { logout } from './resolvers/logout';

export type SchemaGenerationOptions = {
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
    },
    [schemaOptions.rootQueryName]: {
      me: me(Accounts),
    },
  };

  return {
    schema,
    extendWithResolvers: resolversObject => ({
      ...resolversObject,
      [schemaOptions.rootMutationName]: Object.assign(
        resolversObject[schemaOptions.rootMutationName],
        resolvers[schemaOptions.rootMutationName]),
      [schemaOptions.rootQueryName]: Object.assign(
        resolversObject[schemaOptions.rootQueryName],
        resolvers[schemaOptions.rootQueryName]),
      User: Object.assign(
        resolversObject.User || {},
        resolvers.User),
    }),
  };
};
