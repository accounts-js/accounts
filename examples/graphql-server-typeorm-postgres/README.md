# typeorm-server-typescript

This example demonstrate how to use [accounts-js](https://github.com/accounts-js/accounts) with PostgreSQL thanks to the amazing [@accounts/typeorm](https://www.npmjs.com/package/@accounts/typeorm) plugin built by [@birkir](https://github.com/birkir/)for his awesome project: (https://github.com/birkir/prime)[PrimeCMS].

## Setup example

In order to be able to run this example on your machine you first need to do the following steps:

- Clone the repository `git clone git@github.com:accounts-js/accounts.git`
- Install project dependencies: `yarn install`
- Compile the packages `yarn run compile`
- Go to the example folder `cd examples/graphql-server-typeorm-postgres`

## Prerequisites

You will need a PostgreSQL server to run this package. If you don't have a PostgreSQL server running already, and you have Docker & Docker Compose, you can do

```bash
docker-compose up -d
```

to start a new one.

If you have postgres already installed on your system, you can just edit the .env file and use your current postgres data instead of the supplied Docker image.
Alternatively you can simply prepend the `DATABASE_URL` and `ACCOUNTS_SECRET` environmental variables to your `yarn run start` command.

## Getting Started

Start the app.

Visit <http://localhost:4000/>

```bash
yarn run start
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
