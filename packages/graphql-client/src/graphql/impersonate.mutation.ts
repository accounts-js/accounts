import gql from 'graphql-tag';

export const impersonateMutation = (userFieldsFragment: any) => gql`
  ${userFieldsFragment}
  mutation impersonate($accessToken: String!, $username: String!) {
    impersonate(accessToken: $accessToken, username: $username) {
      authorized
      tokens {
        refreshToken
        accessToken
      }
      user {
        ...userFields
      }
    }
  }
`;
