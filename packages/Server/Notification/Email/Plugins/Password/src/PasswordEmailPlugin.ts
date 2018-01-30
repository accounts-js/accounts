import { 
	NotificationPlugin, 
	User 
} from 'accounts';

import { Configuration } from './types/Configuration';

import { merge } from 'lodash';

const defaultConfig: Configuration = {
	from: null
}

export default class PasswordEmailPlugin implements NotificationPlugin {

	public name: string = 'password';

	private from: string | null;

	constructor( config?: Configuration ){
		const configuration = merge({}, defaultConfig, config);
		this.from = configuration.from;

	}


	public enroll = ( send: Function ) => ( { email, user, token }: { email: string, user: User, token: string } ) => {

		const mail = {
			from : this.from,
			to: email,

			subject: 'Set your password',
			text: `To set your password please click on this link: ${token}`
		}

		send(mail);

	}

	public resetPassword = ( send: Function ) => ( { email, user, token }: { email: string, user: User, token: string } ) => {

		const mail = {
			from : this.from,
			to: email,

			subject: 'Reset your password',
			text: `To reset your password please click on this link: ${token}`
		}

		send(mail);

	}

	public verification = ( send: Function ) => ( { email, user, token }: { email: string, user: User, token: string } ) => {

		const mail = {
			from : this.from,
			to: email,

			subject: 'Verify your account email',
			text: `To verify your account email please click on this link: ${token}`
		}

		send(mail);
	}

}