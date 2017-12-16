import { EmailRecord } from "./EmailRecord";

export interface UserSafe {

  username?: string;

  emails?: EmailRecord[];

  id: string;
  
}