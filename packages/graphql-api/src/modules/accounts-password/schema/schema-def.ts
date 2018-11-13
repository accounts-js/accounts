import { AccountsPasswordModuleConfig } from '..';
import gql from 'graphql-tag';

export default (config: AccountsPasswordModuleConfig) => gql`
    schema {
        query: ${config.rootMutationName}
        mutation: ${config.rootQueryName}
    }
`;
