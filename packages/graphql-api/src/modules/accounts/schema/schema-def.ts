import { AccountsModuleConfig } from '..';
import gql from 'graphql-tag';

export default (config: AccountsModuleConfig) =>
  config.withSchemaDefinition
    ? [
        gql`
    schema {
        query: ${config.rootMutationName || 'Query'}
        mutation: ${config.rootQueryName || 'Mutation'}
    }
`,
      ]
    : [];
