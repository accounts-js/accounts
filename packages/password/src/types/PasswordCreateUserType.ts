import { CreateUserType } from '@accounts/common';
import { PasswordType } from './PasswordType';

export interface PasswordCreateUserType extends CreateUserType {
  password: PasswordType;
}
