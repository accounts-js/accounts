import { NotificationPlugin, NotificationPlugins, NotificationService } from 'accounts';

import { Configuration } from './types/Configuration';

import mailgun from 'mailgun-js';

export default class NotificationServiceMailgun implements NotificationService {

  public name: string = 'email';

  private notificationPlugins: NotificationPlugins;


  private from: string;

  private mailgun: any;

  
  constructor( config: Configuration ){

    this.from = config.from || 'Accounts.JS <no-reply@accounts-js.com>';

    this.mailgun = config.mailgun || mailgun({ apiKey: config.apiKey, domain: config.domain });

    this.notificationPlugins = config.notificationPlugins.reduce(
      ( a: NotificationPlugins , notificationPlugin: NotificationPlugin ) => a[notificationPlugin.name] = notificationPlugin
    ,{})

  }

  public send = ( mail: object ) : void => {
    this.mailgun.messages().send(mail)
  }

  public notify = ( notificationPluginName: string, actionName: string, params: object ) : void => 
    this.notificationPlugins[notificationPluginName][actionName](this.send)(params)

}