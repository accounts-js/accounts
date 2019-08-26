import { Twilio } from 'twilio';

import { CodeProvider } from '@accounts/code';

export type MessageCreator = (code: string) => string;

export interface TwilioSmsCodeProviderOptions {
  sid: string;
  secret: string;
  phoneNumber?: string;
  messagingServiceSid?: string;
  messageCreator?: MessageCreator;
}

export default class TwilioSmsCodeProvider implements CodeProvider {
  private messageCreator: MessageCreator;
  private phoneNumber?: string;
  private messagingServiceSid?: string;
  private twilio: Twilio;

  constructor({
    sid,
    secret,
    phoneNumber,
    messagingServiceSid,
    messageCreator = code => `This is your authentication code: ${code}`,
  }: TwilioSmsCodeProviderOptions) {
    this.twilio = new Twilio(sid, secret);
    this.phoneNumber = phoneNumber;
    this.messagingServiceSid = messagingServiceSid;
    this.messageCreator = messageCreator;
  }

  public async sendToClient(serviceId: string, code: string): Promise<void> {
    const options: any = {
      body: this.messageCreator(code),
      to: serviceId,
    };

    if (this.phoneNumber) {
      options.from = this.phoneNumber;
    } else if (this.messagingServiceSid) {
      options.messagingServiceSid = this.messagingServiceSid;
    } else {
      throw new Error('Not enough twilio credentials');
    }

    await this.twilio.messages.create(options);
  }
}
