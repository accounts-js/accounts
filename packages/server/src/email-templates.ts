import { UserObjectType } from '@accounts/common';

export interface EmailTemplateType {
  from?: string,
  subject: (user?: UserObjectType) => string,
  text: (user: UserObjectType, url: string) => string
};

export interface EmailTemplatesType {
  from: string,
  verifyEmail: EmailTemplateType,
  resetPassword: EmailTemplateType,
  enrollAccount: EmailTemplateType
};

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

  enrollAccount: {
    subject: () => 'Set your password',
    text: (user: UserObjectType, url: string) => `To set your password please click on this link: ${url}`,
  },
};
