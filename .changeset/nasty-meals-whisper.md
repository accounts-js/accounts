---
'@accounts/password': patch
'@accounts/two-factor': patch
---

Fix critical issue with "Two-Factor" not validating TOTP codes correctly due to a flawed version of @levminer/speakeasy
