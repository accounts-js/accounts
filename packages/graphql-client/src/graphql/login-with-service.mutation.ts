import gql from 'graphql-tag';

export const loginWithServiceMutation = (userFieldsFragment: any) => gql`
  ${userFieldsFragment}

  mutation($serviceName: String!, $params: AuthenticateParamsInput!) {
    authenticate(serviceName: $serviceName, params: $params) {
      sessionId
      tokens {
        refreshToken
        accessToken
      }
      user {
        ...userFields
      }
    }
  }
`;
