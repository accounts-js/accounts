import React from 'react';
import { compose, withContext, getContext } from 'recompose';

const AccountsProvider: React.SFC<any> = (props: any) =>
  compose(
    withContext({
      accounts: {
        client: props.client,
        options: props.options,
        state: null,
      },
    })
  )(props.children);

const withUser = compose();
