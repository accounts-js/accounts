import gql from 'graphql-tag';
import { AccountsMfaModuleConfig } from '..';

export default (config: AccountsMfaModuleConfig) => gql`
  ${config.extendTypeDefs ? 'extend' : ''} type ${config.rootMutationName || 'Mutation'} {
    challenge(mfaToken: String!, authenticatorId: String!): Boolean
  }
`;
