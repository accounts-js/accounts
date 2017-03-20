import gql from 'graphql-tag';
import { loginFieldsFragment } from './login-fields.fragment';

export const createImpersonateMutation = userFieldsFragment => gql`
  mutation($accessToken: String! $username: String!) {
    impersonate(accessToken: $accessToken, username: $username) {
      authorized
      ...LoginFields
      user {
        id
        ...UserFields
      }
    }
  }
  
  ${userFieldsFragment}
  ${loginFieldsFragment}
`;
