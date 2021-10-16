import gql from 'graphql-tag';

export default ({
  rootMutationName,
  extendTypeDefs = true,
}: {
  rootMutationName?: string;
  extendTypeDefs?: boolean;
}) => gql`
    ${extendTypeDefs ? 'extend' : ''} type ${rootMutationName || 'Mutation'} {
        requestMagicLinkEmail(email: String!): Boolean
    }
`;
