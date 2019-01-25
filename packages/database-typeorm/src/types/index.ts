import { User } from '../entity/User';
import { UserEmail } from '../entity/UserEmail';
import { UserService } from '../entity/UserService';
import { UserSession } from '../entity/UserSession';

export interface AccountsTypeormOptions {
  connectionName?: string;
  userEntity?: typeof User;
  userServiceEntity?: typeof UserService;
  userEmailEntity?: typeof UserEmail;
  userSessionEntity?: typeof UserSession;
}
