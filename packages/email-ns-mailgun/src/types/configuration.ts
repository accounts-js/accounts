import { NotificationPlugin } from '@accounts/types';

export interface Configuration {
	
	from?: string;

	mailgun?: any;

	apiKey?: string;

	domain?: string;

	plugins: NotificationPlugin[];

}