import { EmailRecord } from './email-record';

export interface User {
  username?: string;
  emails?: EmailRecord[];
  id: string;
  services?: Record<string, unknown>;
  deactivated: boolean;
}
