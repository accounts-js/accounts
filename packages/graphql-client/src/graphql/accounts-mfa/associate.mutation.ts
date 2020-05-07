import gql from 'graphql-tag';

export const associateMutation = (associateFieldsFragment?: any) => gql`
  mutation associate($type: String!) {
    associate(type: $type) {
      ... on OTPAssociationResult {
        mfaToken
        authenticatorId
      }
      ${associateFieldsFragment}
    }
  }
`;
