import gql from 'graphql-tag';
import { loginFieldsFragment } from './login-fields.fragment';

export const createLoginMutation = userFieldsFragment => gql`
  mutation($user: String, $userFields: UserInput, $password: String!) {
    loginWithPassword(user: $user, userFields: $userFields, password: $password) {
      sessionId
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
