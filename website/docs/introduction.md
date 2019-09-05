---
id: introduction
title: Introduction
sidebar_label: Introduction
---

The `@accounts` suite of packages aims to provide the consumer an end to end authentication and accounts management solution, with a simple way to start while preserving options for configuration. These packages provide OAuth support for popular providers such as Instagram, Twitter, Github, two factor authentication, password based accounts along with recovery options and customizable account creation and validation.

Three pieces need to be configured to use accounts-js in your application:

#### 1. Transports

Since accounts-js is very flexible, it can be used with multiple transports. For now we provide packages for both [GraphQL](/docs/transports/graphql) and [REST](/docs/transports/rest-express).

#### 2. Databases

We provide a native [mongo](/docs/databases/mongo) integration which is compatible with the meteor account system. We also have a [Typeorm](/docs/databases/typeorm) integration which will let you use accounts-js with any kind of databases.

#### 3. Strategies

You can use multiple strategies to let your users access to your app. For now we support authentication via [email/username and password](/docs/strategies/password), Oauth support is coming soon!

### Prior Art

This project is inspired by Meteor's accounts suite of packages. Meteor framework had a plug and play approach for its monolithic framework that saved a ton of work that is traditionally done by any development team, over and over again. Meteor's accounts system had a couple of restrictions:

- First it was published in Meteor's "atmosphere" package repository and was dependent on the Meteor's build tool.
- Second, Meteor is built around DDP and so its accounts system was taking that for granted.
- Third, Meteor's dependency on MongoDB meant that the business logic was dependant on how the data is stored in the database.

### FAQ

Going into this project we asked ourselves (and were asked by others) a bunch of questions that helped us define what this project is all about. This is part of these questions: If you have a question that you think could shape this project please PR this document or open an issue!

#### Why wouldn't you just use passport?

We are not here to replace passport.js. Actually, in our vision, passport.js will be one authentication method that you can plug in. Currently, the only problem with passport.js in that regard is that it is designed to work with connect middlewares and adapter code is needed to plug into let's say a WS transport. We currently implemented our own local strategy just to make sense out of basic accounts packages. In the near future it will be separated into its own package.

#### Why not refactor out the Meteor accounts suite?

Well, as explained above, Meteor's accounts system is tied to the data storage and transport in a way that is actually harder to separate than rewriting with those abstractions in mind. We do offer an adapter package that allows Meteor applications an easy and gradual way to move out of Meteor's current accounts system.

#### Why do you use a mono-repo?

Early on we understood that a mono-repo is required in order to have a good developer experience while adding any accounts logic. This also helps us keep the codebase relatively small for using apps as you will not load in client code on server apps and vice versa. Although having a mono repo is great, we feel that someone maintaining the Redis package should not get notifications regarding changes on the Mongo or React packages. If you are adding in a feature that requires changes to the transport or the data store packages, we recommend cloning all of the accounts-js packages into the same directory and just open your IDE on that directory as project root.
