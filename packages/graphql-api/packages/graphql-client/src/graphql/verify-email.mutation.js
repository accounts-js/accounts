import gql from 'graphql-tag';

export const verifyEmailMutation = gql`
    mutation($token: String!) {
        verifyEmail(token: $token)
    }
`;
