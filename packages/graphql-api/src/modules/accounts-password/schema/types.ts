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

  type CreateUserResult {
    userId: ID
    loginResult: LoginResult
  }

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
