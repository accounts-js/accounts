import gql from 'graphql-tag';

export const sendResetPasswordEmailMutation = gql`
    mutation($email: String!) {
        sendResetPasswordEmail(email: $email)
    }
`;
