import { IAccountsPasswordModuleConfig } from '..';
import gql from 'graphql-tag';

export default (config: IAccountsPasswordModuleConfig) => gql`
    schema {
        query: ${config.rootMutationName}
        mutation: ${config.rootQueryName}
    }
`;
