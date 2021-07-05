---
id: typeorm
title: TypeORM
sidebar_label: TypeORM
---

A database adapter for [PostgreSQL](https://www.postgresql.org/) using [TypeORM](https://typeorm.io/)

> It is our long-term goal for typeorm package to be database agnostic and support all database types it does by default.
> For now it only works and has been tested with PostgreSQL, feel free to explore other typeorm-integrations.

## Installation

```
yarn add @accounts/typeorm typeorm pg
```

## Usage

```typescript
import { createConnection } from 'typeorm';
import { AccountsServer } from '@accounts/server';
import { AccountsTypeorm, entities } from '@accounts/typeorm';

createConnection({
  type: 'postgres',
  url: 'postgres://user@localhost:5432/dbname',
  entities,
}).then(() => {
  const accountsTypeorm = new AccountsTypeorm({
    // options
  });
  const accountsServer = new AccountsServer(
    { db: accountsTypeorm },
    {
      // services
    }
  );
});
```

## Options

You can use the following options to configure the `@accounts/typeorm` behavior.

```typescript
interface AccountsTypeormOptions {
  cache?: undefined | number;
  connection?: Connection;
  connectionName?: string;
  userEntity?: typeof User;
  userServiceEntity?: typeof UserService;
  userEmailEntity?: typeof UserEmail;
  userSessionEntity?: typeof UserSession;
}
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
  @Column('text')
  profile: string;
}
```

## Example

A working example using the database-typeeorm package with a PostgreSQL database is available [here](https://github.com/accounts-js/accounts/tree/master/examples/graphql-server-typeorm-postgres).
