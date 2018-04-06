import { NotificationPlugin, NotificationPlugins, NotificationService } from '@accounts/types';
import AccountsError from '@accounts/error';
import { Configuration } from './types/configuration';

import mailgun from 'mailgun-js';


export default class EmailServiceMailgun implements NotificationService {

	public name: string = 'email';

  private plugins: NotificationPlugins;
  
	private from: string;

	private mailgun: any;

	
	constructor(config: Configuration){
    // Validate Configuration
    this.validateConfiguration(config);
    // Assign Configuration
    this.from = config.from || 'Accounts.JS <no-reply@accounts-js.com>';
    this.mailgun = config.mailgun || mailgun({ apiKey: config.apiKey, domain: config.domain });
    // Register plugins
		this.plugins = config.plugins.reduce(
      (a: NotificationPlugins ,notificationPlugin: NotificationPlugin) =>
      ({ ...a, [notificationPlugin.name]: notificationPlugin })
		,{})

	}

	public send = (mail: object): void => {
		this.mailgun.messages().send(mail);
	}

	public notify (notificationPluginName: string, actionName: string, params: object): void {
    const plugin = this.plugins[notificationPluginName];
    if(!plugin){
      throw new AccountsError('EmailNotificationServiceMailgun','notify',`The plugin "${notificationPluginName}" is not registered`)
    }
    const action = plugin[actionName];
    if(!action){
      throw new AccountsError('EmailNotificationServiceMailgun','notify',`The action "${actionName}" is not found on plugin "${notificationPluginName}"`)
    }
    action(this.send, params);
  }

  private validateConfiguration(config: Configuration): void {
    if(!config){
      throw new AccountsError('EmailNotificationServiceMailgun','configuration','A configuration object is required');
    }
    const mailgunConfig = config.apiKey && config.domain;
    if(!config.mailgun && !mailgunConfig){
      throw new AccountsError('EmailNotificationServiceMailgun','configuration','The configuration object should either provide a mailgun-js client or an apiKey and a domain');
    }
    if(!config.plugins){
      throw new AccountsError('EmailNotificationServiceMailgun','configuration','The configuration object should provide at least one EmailNotificationPlugin');
    }
  }

}