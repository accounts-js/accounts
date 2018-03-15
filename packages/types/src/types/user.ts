import { EmailRecord } from './email-record';

export interface User {
  username?: string;
  emails?: EmailRecord[];
  id: string;
  profile?: object;
  services?: object;
}