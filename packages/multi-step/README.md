# @accounts/multi-step

## Install

```
yarn add @accounts/multi-step
```

## Usage

```js
import { AccountsServer } from '@accounts/server';
import { AccountsPassword } from '@accounts/password';

export const accountsPassword = new AccountsPassword({
  // options
});

const accountsServer = new AccountsServer(
  {
    // options
  },
  {
    password: accountsPassword,
  }
);
```
