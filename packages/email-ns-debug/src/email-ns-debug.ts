import { NotificationPlugin, NotificationPlugins, NotificationService } from '@accounts/types';
import AccountsError from '@accounts/error';

import { Configuration } from './types/configuration'

export default class EmailServiceMailgun implements NotificationService {

	public name: string = 'email';

  private plugins: NotificationPlugins;
	
	constructor(config: Configuration){
    
    // Register plugins
		this.plugins = config.plugins.reduce(
      (a: NotificationPlugins ,notificationPlugin: NotificationPlugin) =>
      ({ ...a, [notificationPlugin.name]: notificationPlugin })
		,{})

	}

	public send = (mail: object): void => {
		console.dir(mail)
	}

	public notify (notificationPluginName: string, actionName: string, params: object): void {
    const plugin = this.plugins[notificationPluginName];
    if(!plugin){
      throw new AccountsError('EmailNotificationServiceDebug','notify',`The plugin "${notificationPluginName}" is not registered`)
    }
    const action = plugin[actionName];
    if(!action){
      throw new AccountsError('EmailNotificationServiceDebug','notify',`The action "${actionName}" is not found on plugin "${notificationPluginName}"`)
    }
    action(this.send, params);
  }

}