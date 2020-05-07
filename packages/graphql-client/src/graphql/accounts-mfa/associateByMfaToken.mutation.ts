import gql from 'graphql-tag';

export const associateByMfaTokenMutation = (associateFieldsFragment?: any) => gql`
  mutation associateByMfaToken($mfaToken: String!, $type: String!) {
    associateByMfaToken(mfaToken: $mfaToken, type: $type) {
      ... on OTPAssociationResult {
        mfaToken
        authenticatorId
      }
      ${associateFieldsFragment}
    }
  }
`;
