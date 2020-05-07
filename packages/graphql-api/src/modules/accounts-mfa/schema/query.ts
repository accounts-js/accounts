import gql from 'graphql-tag';
import { AccountsMfaModuleConfig } from '..';

export default (config: AccountsMfaModuleConfig) => gql`
  ${config.extendTypeDefs ? 'extend' : ''} type ${config.rootQueryName || 'Query'} {
    # Return the list of the active and inactive authenticators for this user.
    authenticators: [Authenticator]

    # Return the list of the active authenticators for this user.
    authenticatorsByMfaToken(mfaToken: String!): [Authenticator]
  }
`;
