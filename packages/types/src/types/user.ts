import { EmailRecord } from './email-record';

export interface User {
  username?: string;
  email?: string;
  emails?: EmailRecord[];
  id: string;
  profile?: object;
  services?: object;
}