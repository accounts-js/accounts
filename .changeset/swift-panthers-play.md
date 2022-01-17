---
'@accounts/mongo-sessions': minor
'@accounts/database-mongo': minor
---

Changed `idProvider` to `idSessionProvider` in `@mongo-sessions`. This change was made to give more granular control when creating custom identifiers for both sessions and users. The new option generates the _id for new Session objects. Going forward, the `idProvider` will only be used for the creation of user identifiers.

Updated `AccountsMongoOptions` in `@database-mongo` to have the new `idSessionProvider`.

**Migration:** If you are using `idProvider` for the creation of a custom identifier for sessions, then you will need to move that logic to the new `idSessionProvider` function in the configuration.
