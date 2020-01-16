import { User } from './entity/User';
import { UserEmail } from './entity/UserEmail';
import { UserService } from './entity/UserService';
import { UserSession } from './entity/UserSession';

export const defaultOptions = {
  userEntity: User,
  userEmailEntity: UserEmail,
  userServiceEntity: UserService,
  userSessionEntity: UserSession,
};
