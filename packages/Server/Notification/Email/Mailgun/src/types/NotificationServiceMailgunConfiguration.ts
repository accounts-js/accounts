import { NotificationPlugin } from 'accounts';

export interface NotificationServiceMailgunConfiguration {
  
  from?: string;

  mailgun?: any;

  apiKey?: string;

  domain?: string;

  notificationPlugins: NotificationPlugin[];

}