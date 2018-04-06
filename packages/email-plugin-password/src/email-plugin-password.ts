import { NotificationPlugin, User } from '@accounts/types';

import { Configuration } from './types/configuration'

import AccountsError from '@accounts/error';

export default class EmailPluginPassword implements NotificationPlugin {

	public name: string = 'email';

  private from?: string;
	
	constructor(config?: Configuration){
    this.from = config && config.from || undefined;
	}

	public enroll = (send, { email, user, token }: { email: string, user: User, token: string }) => {
		const mail = {
			from : this.from,
			to: email,
			subject: 'Set your password',
			text: `To set your password please click on this link: ${token}`
		}
		send(mail);
	}

	public resetPassword = (send, { email, user, token }: { email: string, user: User, token: string }) => {
		const mail = {
			from : this.from,
			to: email,
			subject: 'Reset your password',
			text: `To reset your password please click on this link: ${token}`
		}
		send(mail);
  }
  
  public verifyEmail = (send, { email, user, token }: { email: string, user: User, token: string }) => {
		const mail = {
			from : this.from,
			to: email,
			subject: 'Verify your account email',
			text: `To verify your account email please click on this link: ${token}`
		}
		send(mail);
	}

}