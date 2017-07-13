import email from 'emailjs';
import { Client } from 'emailjs';

export interface EmailConnector {
  sendMail(mail: object): Promise<object>
}

class Email {
  private server: Client;

  constructor(emailConfig: object) {
    if (emailConfig) {
      this.server = email.server.connect(emailConfig);
    }
  }

  public sendMail(mail: object): Promise<object> {
    return new Promise((resolve, reject) => {
      // If no configuration for email just warn the user
      if (!this.server) {
        console.warn('No configuration for email, you must set an email configuration');
        resolve();
        return;
      }
      this.server.send(mail, (err: object, message: object) => {
        if (err) {
          return reject(err)
        };
        return resolve(message);
      });
    });
  }
}

export default Email;
