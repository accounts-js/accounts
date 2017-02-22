// @flow
import { loginToken } from './resolvers/login-token';
import { newAccessToken } from './resolvers/new-access-token';
import { me } from './resolvers/me';

export const queries = `
  me: User
`;

export const mutations = `
  loginToken(user: UserPasswordInput!): LoginTokenResult
  newAccessToken(refreshToken: String!, accessToken: String!): LoginTokenResult
`;

export const typeDefs = `
  type LoginTokenResult {
    refreshToken: String
    accessToken: String
  }

  input UserPasswordInput {
    email: String
    username: String
    password: String!
  }

  type User {
    id: ID!
    email: String
    username: String
  }
`;

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
    [schemaOptions.rootMutationName]: {
      loginToken: loginToken(Accounts),
      newAccessToken: newAccessToken(Accounts),
    },
    [schemaOptions.rootQueryName]: {
      me,
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
    }),
  };
};
