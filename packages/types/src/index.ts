export { DatabaseInterface as DBInterface } from './types/database-interface';
import { ConnectionInformations as ConnectionInformationsType } from './types/connection-informations';

// ? Tokens
export { Tokens as TokensType } from './types/tokens';
export { TokenRecord } from './types/token-record';
export { Session as SessionType } from './types/session';

// ? User
export { User as UserObjectType } from './types/user';
export { CreateUser as CreateUserType } from './types/create-user';

export { EmailRecord } from './types/email-record';

// ? Operation Results
export { LoginResult as LoginReturnType } from './types/login-result';
export { ImpersonationResult as ImpersonateReturnType } from './types/impersonation-result';

// ? Operation Parameters
/*
  Only used in @accounts/password
  Maybe we should make a Login type on the @accounts/password 
  Or if having a type for a indentifiaction object, we should call it 

  interface Identity {
    id?: string;
    username?: string;
    email?: string;
  }

*/
export { Login as LoginUserIdentityType } from './types/login';

export { HookListener } from './types/hook-listener';
