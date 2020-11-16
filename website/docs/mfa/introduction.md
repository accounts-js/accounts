---
id: introduction
title: Multi-factor Authentication
sidebar_label: Introduction
---

Multi-factor authentication (MFA) is an authentication method in which a computer user is granted access only after successfully presenting two or more pieces of evidence (or factors) to an authentication mechanism:

- knowledge (something the user and only the user knows)
- possession (something the user and only the user has)
- inherence (something the user and only the user is)

https://en.wikipedia.org/wiki/Multi-factor_authentication

## Vocabulary

- **Factor**: Service responsible of the authentication flow, for example OTM, sms, device binding...
- **Authenticator**: Entity representing the hardware or software piece that will be used by a factor to resolve a challenge.
- **Challenge**: Entity the user needs to resolve in order to get a successful authentication.

## Official factors

For now, we provide the following official factors:

- [One-Time Password](/docs/mfa/otp)

## Community factors

- Create a pull request if you want your factor to be listed here.

Not finding the one you are looking for? Check the guide to see how to [create a custom factor](/docs/mfa/create-custom).
