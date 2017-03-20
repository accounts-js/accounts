import gql from 'graphql-tag';
import { loginFieldsFragment } from './login-fields.fragment';

export const createImpersonateMutation = userFieldsFragment => gql`
  mutation($accessToken: String! $user: String!) {
    impersonate(accessToken: $accessToken, user: $user) {
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
