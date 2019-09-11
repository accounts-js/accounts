import gql from 'graphql-tag';
import { AccountsModuleConfig } from '..';

export default ({ userAsInterface }: AccountsModuleConfig) => gql`
  directive @auth on FIELD_DEFINITION | OBJECT

  type Tokens {
    refreshToken: String
    accessToken: String
  }

  type LoginResult {
    sessionId: String
    tokens: Tokens
  }

  type MFALoginResult {
    mfaToken: String
    challenges: [String]
  }

  union LoginWithServiceResult = LoginResult | MFALoginResult

  type ImpersonateReturn {
    authorized: Boolean
    tokens: Tokens
    user: User
  }

  type EmailRecord {
    address: String
    verified: Boolean
  }

  ${userAsInterface ? 'interface' : 'type'} User {
    id: ID!
    emails: [EmailRecord!]
    username: String
  }

  input UserInput {
    id: ID
    email: String
    username: String
  }

  input AuthenticateParamsInput {
    # Twitter, Instagram
    access_token: String
    # Twitter
    access_token_secret: String
    # OAuth
    provider: String
    # Password
    password: String
    # Password
    user: UserInput
    # Two factor
    code: String
  }
`;
