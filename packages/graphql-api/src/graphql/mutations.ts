export const mutations = `
  impersonate(accessToken: String!, username: String!): ImpersonateReturn
  refreshTokens(accessToken: String!, refreshToken: String!): LoginResult
  logout: Boolean

  # Example: Login with password
  # authenticate(serviceName: "password", params: {password: "<pw>", user: {email: "<email>"}})
  authenticate(serviceName: String!, params: AuthenticateParamsInput!): LoginResult
`;

export const mutationsPassword = `
  # Creates a user with a password, returns the id corresponding db ids, such as number IDs, ObjectIDs or UUIDs
  createUser(user: CreateUserInput!): ID
  verifyEmail(token: String!): Boolean
  resetPassword(token: String!, newPassword: String!): Boolean
  sendVerificationEmail(email: String!): Boolean
  sendResetPasswordEmail(email: String!): Boolean
  changePassword(oldPassword: String!, newPassword: String!): Boolean
  twoFactorSet(secret: TwoFactorSecretKeyInput!, code: String!): Boolean
  twoFactorUnset(code: String!): Boolean
`;
