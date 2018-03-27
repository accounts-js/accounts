import { CreateUserType } from '@accounts/common';
import { PasswordType } from './password-type';

export interface PasswordCreateUserType extends CreateUserType {
  password: PasswordType;
}
