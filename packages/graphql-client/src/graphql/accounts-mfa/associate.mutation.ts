import gql from 'graphql-tag';

export const associateMutation = (associateFieldsFragment?: any) => gql`
  mutation associate($type: String!, $params: AssociateParamsInput) {
    associate(type: $type, params: $params) {
      ... on OTPAssociationResult {
        mfaToken
        authenticatorId
      }
      ${associateFieldsFragment}
    }
  }
`;
