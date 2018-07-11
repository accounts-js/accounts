export const typeDefs = `
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

export const typeDefsPassword = `
  type TwoFactorSecretKey {
    ascii: String
    base32: String
    hex: String
    qr_code_ascii: String
    qr_code_hex: String
    qr_code_base32: String
    google_auth_qr: String
    otpauth_url: String
  }

  input TwoFactorSecretKeyInput {
    ascii: String
    base32: String
    hex: String
    qr_code_ascii: String
    qr_code_hex: String
    qr_code_base32: String
    google_auth_qr: String
    otpauth_url: String
  }

  input CreateUserInput {
    username: String
    email: String
    password: String
  }
`;
