export const mutations = `
  loginWithPassword(user: String!, password: String!): LoginReturn
  refreshTokens(accessToken: String!, refreshToken: String!): LoginReturn
  logout(accessToken: String!): Boolean
  impersonate(accessToken: String! user: String!): ImpersonateReturn
  # createUser: String
  # verifyEmail(token: String!): Boolean
  # resetPassword(token: String!, newPassword: String!): Boolean
  # sendVerificationEmail(userId: String!, email: String!): Boolean
  # sendResetPasswordEmail(userId: String!, email: String!): Boolean
`;
