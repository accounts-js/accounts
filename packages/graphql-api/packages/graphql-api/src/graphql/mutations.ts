export const mutations = `
  loginWithPassword(user: String, userFields: UserInput, password: String!): LoginReturn
  refreshTokens(accessToken: String!, refreshToken: String!): LoginReturn
  logout(accessToken: String!): Boolean
  impersonate(accessToken: String! username: String!): ImpersonateReturn
  createUser(user: CreateUserInput!): Boolean
  verifyEmail(token: String!): Boolean
  resetPassword(token: String!, newPassword: String!): Boolean
  sendVerificationEmail(email: String!): Boolean
  sendResetPasswordEmail(email: String!): Boolean
`;
