import { 
  NotificationPlugin, 
  NotificationPlugins, 
  NotificationService
} from 'accounts';

import { Configuration } from './types/Configuration';

export default class EmailServiceDebug implements NotificationService {

  public name: string = 'email';

  private notificationPlugins: NotificationPlugins;
  
  constructor( config: Configuration ){

    this.notificationPlugins = config.notificationPlugins.reduce(
      ( a: NotificationPlugins , notificationPlugin: NotificationPlugin ) => a[notificationPlugin.name] = notificationPlugin
    ,{})

  }

  public send = ( mail: object ) : void => {
    console.dir(mail);
  }

  public notify = ( notificationPluginName: string, actionName:string, params: object ) : void => 
    this.notificationPlugins[ notificationPluginName ][ actionName ](this.send)(params)

}