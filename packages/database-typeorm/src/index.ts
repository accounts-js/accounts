import { AccountsTypeorm } from './typeorm';
import { User } from './entity/User';
import { UserEmail } from './entity/UserEmail';
import { UserService } from './entity/UserService';
import { UserSession } from './entity/UserSession';
import { MfaLoginAttempt } from './entity/MfaLoginAttempt';

const entities = [User, UserEmail, UserService, UserSession, MfaLoginAttempt];

export { AccountsTypeorm, User, UserEmail, UserService, UserSession, MfaLoginAttempt, entities };
export default AccountsTypeorm;
