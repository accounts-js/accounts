import gql from 'graphql-tag';

export const createUserMutation = gql`
  mutation register($user: CreateUserInput!) {
    register(user: $user)
  }
`;
