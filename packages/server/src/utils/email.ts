import { User } from '@accounts/types';
import { EmailTemplateType } from '../types/email-template-type';
import { EmailTemplatesType } from '../types/email-templates-type';

export const emailTemplates = {
  from: 'accounts-js <no-reply@accounts-js.com>',

  verifyEmail: {
    subject: () => 'Verify your account email',
    text: (user: User, url: string) =>
      `To verify your account email please click on this link: ${url}`,
  },

  resetPassword: {
    subject: () => 'Reset your password',
    text: (user: User, url: string) => `To reset your password please click on this link: ${url}`,
  },

  enrollAccount: {
    subject: () => 'Set your password',
    text: (user: User, url: string) => `To set your password please click on this link: ${url}`,
  },
};

export type SendMailType = (mail: object) => Promise<void>;

export const sendMail = async (mail: object): Promise<void> => {
  // tslint:disable-next-line no-console
  console.warn('No configuration for email, you must set an email configuration');
  // tslint:disable-next-line no-console
  console.log(mail);
};
