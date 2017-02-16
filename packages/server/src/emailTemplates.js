// @flow

export default {
  from: 'js-accounts <no-reply@js-accounts.com>',

  verifyEmail: {
    subject: () => 'Verify your account email',
    text: (user: UserObjectType, url: string) => `To verify your account email please click on this link: ${url}`,
  },

  resetPassword: {
    subject: () => 'Reset your password',
    text: (user: UserObjectType, url: string) => `To reset your password please click on this link: ${url}`,
  },
};
