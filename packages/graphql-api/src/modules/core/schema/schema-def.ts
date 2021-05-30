import { gql } from 'graphql-modules';
import { AccountsModuleConfig } from '..';

export default (config: AccountsModuleConfig) =>
  config.withSchemaDefinition
    ? [
        gql(`
          schema {
            query: ${config.rootQueryName || 'Query'}
            mutation: ${config.rootMutationName || 'Mutation'}
          }
        `),
      ]
    : [];
