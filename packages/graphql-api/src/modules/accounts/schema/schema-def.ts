import { AccountsModuleConfig } from '..';
import gql from 'graphql-tag';

export default (config: AccountsModuleConfig) =>
  config.withSchemaDefinition
    ? gql`
    schema {
        query: ${config.rootMutationName}
        mutation: ${config.rootQueryName}
    }
`
    : [];
