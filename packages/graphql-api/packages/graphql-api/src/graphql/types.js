export const typeDefs = `
  type Tokens {
    refreshToken: String
    accessToken: String
  }
  
  type LoginReturn {
    sessionId: String
    user: User
    tokens: Tokens
  }

  type User {
    id: ID!
    email: String
    username: String
  }
`;
