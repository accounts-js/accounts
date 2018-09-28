# graphql-server-typescript

This example demonstrate how to use [accounts-js](https://github.com/accounts-js/accounts).

## Prerequisites

You will need a MongoDB server to run this server. If you don't have a MongoDB server running already, and you have Docker & Docker Compose, you can do

```bash
docker-compose up -d
```

to start a new one.

## Getting Started

```bash
git clone https://github.com/accounts-js/examples.git
cd examples/graphql-server-typescript
yarn install
```

Start the app.

Visit http://localhost:4000/

```bash
yarn start
```

-> [Start the client side](../react-graphql-typescript).

```graphql
mutation Register {
  register(user: { username: "user", password: "1234567" })
}

mutation Auth {
  authenticate(
    serviceName: "password"
    params: { password: "1234567", user: { username: "user" } }
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
