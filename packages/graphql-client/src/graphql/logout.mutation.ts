import gql from 'graphql-tag';

export const logoutMutation = gql`
  mutation logout {
    logout
  }
`;
