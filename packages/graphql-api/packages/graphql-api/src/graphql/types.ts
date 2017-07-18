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
  
  type ImpersonateReturn {
    authorized: Boolean
    tokens: Tokens
    user: User
  }

  type User {
    id: ID!
    email: String
    username: String
  }
  
  input UserInput {
    id: ID
    email: String
    username: String
  }
  
  input CreateUserInput {
    username: String
    email: String
    password: String
    profile: CreateUserProfileInput
  }
  
  type PasswordType {
    digest: String
    algorithm: String
  }
  
  input PasswordInput {
    digest: String
    algorithm: String
  }
  
  input CreateUserProfileInput {
    name: String
    firstName: String
    lastName: String
  }
`;
