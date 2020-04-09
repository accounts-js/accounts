import { CreateUser } from '../../create-user';

export interface CreateUserServicePassword extends CreateUser {
  username?: string;
  email?: string;
  password: string;
}
