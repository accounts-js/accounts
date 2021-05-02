import gql from 'graphql-tag';
import { AccountsTokenModuleConfig } from '..';

export default (config: AccountsTokenModuleConfig) => gql`
    ${config.extendTypeDefs ? 'extend' : ''} type ${config.rootMutationName || 'Mutation'} {
        requestLoginToken(email: String!): Boolean
    }
`;
