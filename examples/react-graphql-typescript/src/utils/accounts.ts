import { AccountsClient } from '@accounts/client';
import { AccountsClientPassword } from '@accounts/client-password';
import GraphQLClient from '@accounts/graphql-client';
import { accountsLink } from '@accounts/apollo-link';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { from } from 'apollo-link';
import { InMemoryCache } from 'apollo-cache-inmemory';

// This auth link will inject the token in the headers on every request you make using apollo client
const authLink = accountsLink(() => accountsClient);

const httpLink = new HttpLink({
  uri: 'http://localhost:4000/graphql',
});

const apolloClient = new ApolloClient({
  link: from([authLink, httpLink]),
  cache: new InMemoryCache(),
});

const accountsGraphQL = new GraphQLClient({ graphQLClient: apolloClient });
const accountsClient = new AccountsClient({}, accountsGraphQL);
const accountsPassword = new AccountsClientPassword(accountsClient);

export { accountsClient, accountsGraphQL, accountsPassword, apolloClient };
