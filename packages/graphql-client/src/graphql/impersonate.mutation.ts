import gql from 'graphql-tag';

export const impersonateMutation = gql`
  mutation impersonate($accessToken: String!, $username: String!) {
    impersonate(accessToken: $accessToken, username: $username) {
      authorized
      tokens {
        refreshToken
        accessToken
      }
      # // TODO: Extract user into a fragment
      user {
        id
        emails {
          address
          verified
        }
        username
      }
    }
  }
`;
