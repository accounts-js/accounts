import { AccountsModuleConfig } from '..';
import gql from 'graphql-tag';

export default (config: AccountsModuleConfig) => gql`
    schema {
        query: ${config.rootMutationName}
        mutation: ${config.rootQueryName}
    }
`;
