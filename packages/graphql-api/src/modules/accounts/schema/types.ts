import gql from 'graphql-tag';

export default gql`
  type Tokens {
    refreshToken: String
    accessToken: String
  }

  type LoginResult {
    sessionId: String
    tokens: Tokens
  }

  type ImpersonateReturn {
    authorized: Boolean
    tokens: Tokens
    user: User
  }

  type EmailRecord {
    address: String
    verified: Boolean
  }

  type User {
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
