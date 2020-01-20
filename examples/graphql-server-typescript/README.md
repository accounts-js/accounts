# graphql-server-typescript

This example demonstrate how to use [accounts-js](https://github.com/accounts-js/accounts).

## Setup example

In order to be able to run this example on your machine you first need to do the following steps:

- Clone the repository `git clone git@github.com:accounts-js/accounts.git`
- Install project dependencies: `yarn`
- Link together all the packages: `yarn setup`
- Compile the packages `yarn compile`
- Go to the example folder `cd examples/graphql-server-typescript`

## Prerequisites

You will need a MongoDB server to run this server. If you don't have a MongoDB server running already, and you have Docker & Docker Compose, you can do

```bash
docker-compose up -d
```

to start a new one.

## Getting Started

Start the app.

Visit http://localhost:4000/

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
