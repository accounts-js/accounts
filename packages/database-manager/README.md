# @accounts/database-manager

## Install

```
yarn add @accounts/database-manager
```

## Usage

```javascript
import { AccountsServer } from '@accounts/server';
import { DatabaseManager } from '@accounts/database-manager';

const accountsDb = new DatabaseManager({
  userStorage: // Your user storage db
  sessionStorage: // Your session storage db
});

const accountsServer = new AccountsServer({ db: accountsDb });
```
