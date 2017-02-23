import gql from 'graphql-tag'; import { loginFieldsFragment } from './login-fields.fragment';

export const loginMutation = gql`
    mutation($user: String!, $password: String!) {
        loginWithPassword(user: $user, password: $password) {
            ...LoginFields
        }
    }
  
    ${loginFieldsFragment}
`;
