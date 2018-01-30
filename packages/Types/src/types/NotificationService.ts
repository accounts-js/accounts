

export interface NotificationService {

	name: string;

	send( mail:object ) : void

	notify( notificaationPluginName: string, action: string, params: object ) : void
	
}

export interface NotificationServices {

	[ notificationServiceName: string ]: NotificationService

}