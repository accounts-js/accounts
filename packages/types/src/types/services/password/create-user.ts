import { CreateUser } from '../../create-user';

export interface CreateUserServicePassword extends CreateUser {
  username?: string;
  email?: string;
  password: string;
  receiveOther: boolean;
  receiveFastep: boolean;
  certifyAge: boolean;
  readTerms: boolean;
  allSelect: boolean;
}
