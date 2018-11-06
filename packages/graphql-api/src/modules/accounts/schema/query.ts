import gql from 'graphql-tag';
import { IAccountsModuleConfig } from '..';

export default (config: IAccountsModuleConfig) => gql`
    ${config.extendTypeDefs ? 'extend' : ''} type ${config.rootQueryName || 'Query'}  {
        getUser: User
    }
`;
