# typeorm-server-typescript

This example demonstrate how to use [accounts-js](https://github.com/accounts-js/accounts) with PostgreSQL thanks to the amazing [@accounts/typeorm](https://www.npmjs.com/package/@accounts/typeorm) plugin built by (https://github.com/birkir/)[@birkir]for his awesome project: (https://github.com/birkir/prime)[PrimeCMS].

## Prerequisites

If you're on a mac, you will probably already have postgres installed as a brew service.
just edit the .env file and use your current postgres data

You will need a PostgreSQL server to run this package. If you don't have a PostgreSQL server running already, and you have Docker & Docker Compose, you can do

```bash
docker-compose up -d
```

to start a new one.

## Getting Started

```bash
git clone https://github.com/accounts-js/accounts-js.git
cd examples/graphql-server-typeorm-postgres
yarn install
```

Start the app.

Visit <http://localhost:4000/>

```bash
yarn start
```

-> [Start the client side](../react-graphql-typescript).

```graphql
mutation CreateUser {
  createUser(
    user: {
      email: "john.does@john.com"
      password: "1234567"
      profile: { firstName: "John", lastName: "Doe" }
    }
  )
}

mutation Auth {
  authenticate(
    serviceName: "password"
    params: { password: "1234567", user: { email: "john.does@john.com" } }
  ) {
    tokens {
      accessToken
    }
  }
}

query Test {
  privateField
}
```
