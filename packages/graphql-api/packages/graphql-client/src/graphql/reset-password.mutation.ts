import gql from 'graphql-tag';

export const resetPasswordMutation = gql`
    mutation($token: String!, $password: PasswordInput!) {
        resetPassword(token: $token, password: $password)
    }
`;
