import gql from 'graphql-tag';
import { loginFieldsFragment } from './login-fields.fragment';

export const createRefreshTokenMutation = userFieldsFragment => gql`
    mutation($accessToken: String!, $refreshToken: String!) {
        refreshTokens(accessToken: $accessToken, refreshToken: $refreshToken) {
            ...LoginFields
            user {
                ...UserFields
            }
        }
    }

    ${userFieldsFragment}
    ${loginFieldsFragment}
`;

