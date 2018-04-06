export interface NotificationPlugin {
	
  name: string;

}

export interface NotificationPlugins {

  [ notificationPluginName: string ]: NotificationPlugin

}