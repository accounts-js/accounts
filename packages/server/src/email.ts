import * as email from 'emailjs';
import { Client } from 'emailjs'; // tslint:disable-line no-duplicate-imports
import { UserObjectType } from '@accounts/common';

export interface EmailTemplateType {
  from?: string;
  subject: (user?: UserObjectType) => string;
  text: (user: UserObjectType, url: string) => string;
}

export interface EmailTemplatesType {
  from: string;
  verifyEmail: EmailTemplateType;
  resetPassword: EmailTemplateType;
  enrollAccount: EmailTemplateType;
}

export const emailTemplates = {
  from: 'js-accounts <no-reply@js-accounts.com>',

  verifyEmail: {
    subject: () => 'Verify your account email',
    text: (user: UserObjectType, url: string) =>
      `To verify your account email please click on this link: ${url}`,
  },

  resetPassword: {
    subject: () => 'Reset your password',
    text: (user: UserObjectType, url: string) =>
      `To reset your password please click on this link: ${url}`,
  },

  enrollAccount: {
    subject: () => 'Set your password',
    text: (user: UserObjectType, url: string) =>
      `To set your password please click on this link: ${url}`,
  },
};

export interface EmailConnector {
  sendMail(mail: object): Promise<object>;
}

class Email {
  private server: Client;

  constructor(emailConfig: object) {
    if (emailConfig) {
      this.server = emailServer.connect(emailConfig);
    }
  }

  public sendMail(mail: object): Promise<object> {
    return new Promise((resolve, reject) => {
      // If no configuration for email just warn the user
      if (!this.server) {
        // tslint:disable-next-line no-console
        console.warn(
          'No configuration for email, you must set an email configuration'
        );
        // tslint:disable-next-line no-console
        console.log(mail);
        resolve();
        return;
      }
      this.server.send(mail, (err: object, message: object) => {
        if (err) {
          return reject(err);
        }
        return resolve(message);
      });
    });
  }
}

export default Email;
