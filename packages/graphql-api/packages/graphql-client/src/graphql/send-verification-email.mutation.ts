import gql from 'graphql-tag';

export const sendVerificationEmailMutation = gql`
    mutation($email: String!) {
        sendVerificationEmail(email: $email)
    }
`;
