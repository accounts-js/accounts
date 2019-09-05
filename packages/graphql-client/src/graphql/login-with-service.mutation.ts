import gql from 'graphql-tag';

export const loginWithServiceMutation = gql`
  mutation($serviceName: String!, $params: JSON!) {
    authenticate(serviceName: $serviceName, params: $params) {
      sessionId
      tokens {
        refreshToken
        accessToken
      }
    }
  }
`;
