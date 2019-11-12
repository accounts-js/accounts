import gql from 'graphql-tag';

export const authenticateWithServiceMutation = gql`
  mutation($serviceName: String!, $params: AuthenticateParamsInput!) {
    verifyAuthentication(serviceName: $serviceName, params: $params)
  }
`;
