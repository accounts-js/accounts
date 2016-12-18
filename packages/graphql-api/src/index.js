// @flow

import gql from 'graphql-tag';
import type { ExecutionResult } from 'graphql';
import type { ApolloClient } from 'apollo-client';
import type { LoginWithPassword } from 'LoginMutation';

import loginMutation from './mutations/login.graphql';

export default class Client {
  
  constructor( apolloClient: ApolloClient ) {
    this.client = apolloClient;
  }
  
  loginWithPassword( user: UserPasswordInput ): Promise<?LoginWithPassword> {
    return this.client
    .mutate({
      mutation: gql`${loginMutation}`,
      variables: { user: { email: user.email, password: user.password } },
    })
    .then((res: ExecutionResult) => (res.data && res.data['loginWithPassword']: ?LoginWithPassword));
  }
  
  client: ApolloClient;
}
