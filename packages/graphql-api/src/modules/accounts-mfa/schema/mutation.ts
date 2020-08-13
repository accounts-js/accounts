import gql from 'graphql-tag';
import { AccountsMfaModuleConfig } from '..';

export default (config: AccountsMfaModuleConfig) => gql`
  ${config.extendTypeDefs ? 'extend' : ''} type ${config.rootMutationName || 'Mutation'} {
    # Request a challenge for the MFA authentication.
    challenge(mfaToken: String!, authenticatorId: String!): ChallengeResult
    # Start the association of a new authenticator.
    associate(type: String!, params: AssociateParamsInput): AssociationResult
    # Start the association of a new authenticator, this method is called when the user is enforced to associate an authenticator before the first login.
    associateByMfaToken(mfaToken: String!, type: String!, params: AssociateParamsInput): AssociationResult
  }
`;
