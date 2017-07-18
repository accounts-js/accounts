import gql from 'graphql-tag';

export const createUserMutation = gql`    
  mutation($user: CreateUserInput!) {
    createUser(user: $user)
  }
`;
