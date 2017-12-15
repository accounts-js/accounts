import { NotificationPlugin } from 'accounts';

export interface Configuration {
  
  from?: string;

  mailgun?: any;

  apiKey?: string;

  domain?: string;

  notificationPlugins: NotificationPlugin[];

}