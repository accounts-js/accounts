import gql from 'graphql-tag';

export const resetPasswordMutation = gql`
    mutation($token: String!, $newPassword: PasswordInput!) {
        resetPassword(token: $token, newPassword: $password)
    }
`;
