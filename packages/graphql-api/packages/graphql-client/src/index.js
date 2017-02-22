// @flow

import gql from 'graphql-tag';
import type { ExecutionResult } from 'graphql';
import type { ApolloClient } from 'apollo-client';

export default class Client {
  client: ApolloClient;

  constructor( apolloClient: ApolloClient ) {
    this.client = apolloClient;
  }
  
  loginWithPassword( user: UserPasswordInput ): Promise<?LoginWithPassword> {
    return this.client
    .mutate({
      mutation: gql`${loginMutation}`,
      variables: { user: { email: user.email, password: user.password } },
    })
    .then(() => {

    });
  }
  
}
