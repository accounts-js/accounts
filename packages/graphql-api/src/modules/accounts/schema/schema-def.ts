import { IAccountsModuleConfig } from '..';
import gql from 'graphql-tag';

export default (config: IAccountsModuleConfig) => gql`
    schema {
        query: ${config.rootMutationName}
        mutation: ${config.rootQueryName}
    }
`;
