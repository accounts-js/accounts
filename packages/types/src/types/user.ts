import { EmailRecord } from './email-record';

export interface User {
  username?: string;
  emails?: EmailRecord[];
  id: string;
  services?: Record<string, any>;
  deactivated: boolean;
  receiveOther: boolean;
  receiveFastep: boolean;
  certifyAge: boolean;
  readTerms: boolean;
  allSelect: boolean;
}
