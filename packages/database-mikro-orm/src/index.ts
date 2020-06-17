import { AccountsMikroOrm } from './mikro-orm';
import { User, UserConstructor } from './entity/User';
import { UserEmail } from './entity/UserEmail';
import { UserService } from './entity/UserService';
import { UserSession } from './entity/UserSession';
import { User as IUser } from '@accounts/types/lib/types/user';

const entities = [User, UserEmail, UserService, UserSession];

export {
  AccountsMikroOrm,
  UserConstructor,
  IUser,
  User,
  UserEmail,
  UserService,
  UserSession,
  entities,
};
export default AccountsMikroOrm;
