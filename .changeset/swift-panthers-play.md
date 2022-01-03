---
'@accounts/mongo-sessions': minor
---

Changed `idProvider` to `idSessionProvider` in mongo-sessions. If you are using `idProvider` for the creation of a custom identifier for sessions, then you will need to move that logic to a new `idSessionProvider` function in the configuration. Going forward, the `idProvider` will only be used for the creation of user identifiers. This change was made to give more granular control when creating custom identifiers for both sessions and users.
