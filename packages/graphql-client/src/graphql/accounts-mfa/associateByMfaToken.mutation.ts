import gql from 'graphql-tag';

export const associateByMfaTokenMutation = (associateFieldsFragment?: any) => gql`
  mutation associateByMfaToken($mfaToken: String!, $type: String!, $params: AssociateParamsInput) {
    associateByMfaToken(mfaToken: $mfaToken, type: $type, params: $params) {
      ... on OTPAssociationResult {
        mfaToken
        authenticatorId
      }
      ${associateFieldsFragment}
    }
  }
`;
