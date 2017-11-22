import gql from 'graphql-tag';

export const resetPasswordMutation = gql`
    mutation($token: String!, $newPassword: String!) {
        resetPassword(token: $token, newPassword: $newPassword)
    }
`;
