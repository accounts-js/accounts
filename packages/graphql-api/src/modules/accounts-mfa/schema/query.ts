import gql from 'graphql-tag';
import { AccountsMfaModuleConfig } from '..';

export default (config: AccountsMfaModuleConfig) => gql`
  ${config.extendTypeDefs ? 'extend' : ''} type ${config.rootQueryName || 'Query'} {
    authenticators(mfaToken: String): [Authenticator]
  }
`;
