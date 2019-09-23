# @accounts/asymmetric

## Install

```
yarn add @accounts/asymmetric
```

## Usage

```js
import { AccountsServer } from '@accounts/server';
import { AccountsAsymmetric } from '@accounts/asymmetric';

export const accountsAsymmetric = new AccountsAsymmetric({
  // options
});

const accountsServer = new AccountsServer(
  {
    // options
  },
  {
    asymmetric: accountsAsymmetric,
  }
);
```
