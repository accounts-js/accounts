export const defaultSharedConfig = {
  sendVerificationEmail: false,
  forbidClientAccountCreation: false,
  restrictCreationByEmailDomain: null,
  loginExpirationInDays: 90,
  passwordResetTokenExpirationInDays: 3,
  passwordEnrollTokenExpirationInDays: 30,
};

export const defaultClientConfig = {
  ...defaultSharedConfig,
};

export const defaultServerConfig = {
  ...defaultSharedConfig,
  // TODO Investigate oauthSecretKey
  // oauthSecretKey
};
