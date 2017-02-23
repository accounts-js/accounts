import gql from 'graphql-tag'; import { loginFieldsFragment } from './login-fields.fragment';

export const refreshTokenMutation = gql`
    mutation($accessToken: String!, $refreshToken: String!) {
        refreshTokens(accessToken: $accessToken, refreshToken: $refreshToken) {
            ...LoginFields
        }
    }

    ${loginFieldsFragment}
`;
