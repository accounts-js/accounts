// @flow
import email from 'emailjs';
import type { Client } from 'emailjs';

export interface EmailConnector {
  sendMail(mail: Object): Promise<?Object>
}

class Email {
  server: Client;

  constructor(emailConfig: ?Object) {
    if (emailConfig) {
      this.server = email.server.connect(emailConfig);
    }
  }

  sendMail(mail: Object): Promise<?Object> {
    return new Promise((resolve, reject) => { // eslint-disable-line flowtype/require-parameter-type
      // If no configuration for email just warn the user
      if (!this.server) {
        console.log('No configuration for email, you must set an email configuration');
        resolve();
        return;
      }
      this.server.send(mail, (err: Object, message: Object) => {
        if (err) return reject(err);
        return resolve(message);
      });
    });
  }
}

export default Email;
