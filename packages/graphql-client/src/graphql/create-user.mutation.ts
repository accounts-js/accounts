import gql from 'graphql-tag';

export const createUserMutation = gql`
  mutation createUser($user: CreateUserInput!) {
    createUser(user: $user) {
      userId
      loginResult {
        sessionId
        tokens {
          refreshToken
          accessToken
        }
      }
    }
  }
`;
