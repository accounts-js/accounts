import mailgun from 'mailgun-js';
import { NotificationService, NotificationPlugin, NotificationPlugins } from 'accounts';

import { NotificationServiceMailgunConfiguration } from './types/NotificationServiceMailgunConfiguration';

export default class NotificationServiceMailgun implements NotificationService {

  public name: string = 'email';

  private notificationPlugins: NotificationPlugins;


  private from: string;

  private mailgun: any;

  
  constructor( config: NotificationServiceMailgunConfiguration ){

    this.from = config.from || 'Accounts.JS <no-reply@accounts-js.com>';

    this.mailgun = config.mailgun || mailgun({ apiKey: config.apiKey, domain: config.domain });

    this.notificationPlugins = config.notificationPlugins.reduce(
      ( a: NotificationPlugins , notificationPlugin: NotificationPlugin ) => a[notificationPlugin.name] = notificationPlugin
    ,{})

  }

  send = ( mail: object ) : void => {
    this.mailgun.messages().send(mail)
  }

  notify = ( notificationPluginName: string, actionName: string, params: object ) : void => 
    this.notificationPlugins[notificationPluginName][actionName](this.send)(params)

}