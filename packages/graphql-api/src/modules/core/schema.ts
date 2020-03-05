import gql from 'graphql-tag';
import { CoreAccountsModuleConfig } from './index';

export default ({ userAsInterface }: CoreAccountsModuleConfig) => gql`
  ${userAsInterface ? 'interface' : 'type'} User {
    id: ID!
    emails: [EmailRecord!]
    username: String
  }

  type EmailRecord {
    address: String
    verified: Boolean
  }
  
  type Tokens {
    refreshToken: String
    accessToken: String
  }

  type LoginResult {
    sessionId: String
    tokens: Tokens
    user: User
  }
`;
