import { AccountsClient } from '@accounts/client';
import { AccountsClientPassword } from '@accounts/client-password';
import GraphQLClient from '@accounts/graphql-client';
import ApolloClient from 'apollo-boost';

const apolloClient = new ApolloClient({
  headers: function createHeaders() {
    console.log('arguments', arguments);
  },
  uri: 'http://localhost:4000/graphql',
});

const accountsGraphQL = new GraphQLClient({ graphQLClient: apolloClient });
const accountsClient = new AccountsClient({}, accountsGraphQL);
const accountsPassword = new AccountsClientPassword(accountsClient);

export { accountsClient, accountsGraphQL, accountsPassword, apolloClient };
