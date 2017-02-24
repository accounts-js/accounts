import gql from 'graphql-tag';
import { loginFieldsFragment } from './login-fields.fragment';

export const createLoginMutation = userFieldsFragment => gql`
  mutation($user: String!, $password: String!) {
    loginWithPassword(user: $user, password: $password) {
      sessionId
      user {
        id
        ...UserFields
      }
      ...LoginFields
    }
  }

  ${loginFieldsFragment}
  ${userFieldsFragment}
`;
