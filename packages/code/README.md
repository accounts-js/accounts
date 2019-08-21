# @accounts/code

## Install

```
yarn add @accounts/code
```

## Usage

```js
import { AccountsServer } from '@accounts/server';
import { AccountsCode } from '@accounts/code';

const codeProvider = '...';

export const accountsCode = new AccountsCode({
  codeProvider,
  // options
});

const accountsServer = new AccountsServer(
  {
    // options
  },
  {
    code: accountsCode,
  }
);
```
