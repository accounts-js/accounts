import gql from 'graphql-tag';

export const createUserMutation = (userFieldsFragment: any) => gql`
  ${userFieldsFragment}

  mutation createUser($user: CreateUserInput!) {
    createUser(user: $user) {
      userId
      loginResult {
        sessionId
        tokens {
          refreshToken
          accessToken
        }
        user {
          ...userFields
        }
      }
    }
  }
`;
