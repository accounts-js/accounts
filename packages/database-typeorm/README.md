# @accounts/typeorm

_TypeORM adaptor for accounts_

[![npm](https://img.shields.io/npm/v/@accounts/typeorm.svg?maxAge=2592000)](https://www.npmjs.com/package/@accounts/typeorm)
![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)

## Note

This package is under active development.

## Install

```
yarn add @accounts/typeorm
```

## Usage

```javascript
import { createConnection } from 'typeorm';
import { AccountsServer } from '@accounts/server';
import { AccountsTypeorm, entities } from '@accounts/typeorm';

createConnection({
  type: 'postgres',
  url: 'postgres://user@localhost:5432/dbname',
  entities,
}).then(() => {
  const accountsTypeorm = new Typeorm();
  const accountsServer = new AccountsServer({ db: accountsTypeorm });
});
```

## Options

```ts
type Options = {
  cache?: undefined | number; // Cache results from database (in ms)
  connection?: Connection; // Pass a connection instance
  connectionName?: string; // Use a connection name (if other than "default")
  userEntity?: typeof User; // Overwrite entities with your own
  userServiceEntity?: typeof UserService;
  userEmailEntity?: typeof UserEmail;
  userSessionEntity?: typeof UserSession;
};
```

### Extending entities

If you want to add fields, etc. to the User entity you can, by extending the base entities.

```tsx
import { User as AccountsUser } from '@accounts/typeorm';

@Entity()
export class User extends AccountsUser {
  // Add fields
  @Column()
  custom_field: string;

  // Overwrite fields
  @Colum('text')
  profile: string;
}
```
