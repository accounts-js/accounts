import { EmailRecord } from './email-record';

export interface UserSafe {
  username?: string;
  emails?: EmailRecord[];
  id: string;
  profile?: object;
}

export interface User extends UserSafe {
  services?: object;
}