---
id: getting-started
title: Getting started with Express
sidebar_label: Getting started
---

accounts-js provide an [Express](https://expressjs.com/) adapter to help you adding the REST API to your app.
We expose a set of routes to allow you to interact with it. These routes are generated based on the services you use. In this chapter, we assume that you have a basic understanding of the Express API.

TODO

## Setting up mongoose

TODO

## Setting up express

Let's get started by adding the required packages we need

```
yarn add express body-parser
```

Once the packages are installed, we can setup the express server. If you are adding accounts-js in your app and your express server is already setup you can skip this step.

```typescript
import express from 'express';
import bodyParser from 'body-parser';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(3000);
```

## Setting up accounts-js server

TODO

## Setting up the REST API

TODO

## Available routes

TODO in a separate page

## Errors

TODO

TODO in a separate page add the client documentation
