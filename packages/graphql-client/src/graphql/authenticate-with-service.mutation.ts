import gql from 'graphql-tag';

export const authenticateWithServiceMutation = gql`
  mutation($serviceName: String!, $params: AuthenticateParamsInput!) {
    authenticateWithoutSessionCreation(serviceName: $serviceName, params: $params)
  }
`;
