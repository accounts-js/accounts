import { AccountsTypeorm } from './typeorm';
import { User } from './entity/User';
import { UserEmail } from './entity/UserEmail';
import { UserService } from './entity/UserService';
import { UserSession } from './entity/UserSession';
import {
  AccountsTypeORMConfigToken,
  AccountsTypeormOptions,
  UserEmailToken,
  UserServiceToken,
  UserSessionToken,
  UserToken,
} from './types';

const entities = [User, UserEmail, UserService, UserSession];

export {
  AccountsTypeorm,
  User,
  UserEmail,
  UserService,
  UserSession,
  entities,
  UserToken,
  UserEmailToken,
  UserServiceToken,
  UserSessionToken,
  AccountsTypeORMConfigToken,
  AccountsTypeormOptions,
};
export default AccountsTypeorm;
