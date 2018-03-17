import { DatabaseInterface } from './types/database-interface';
import { ConnectionInformations } from './types/connection-informations';
import { Tokens } from './types/tokens';
import { TokenRecord } from './types/token-record';
import { Session } from './types/session';
import { User } from './types/user';
import { CreateUser } from './types/create-user';
import { EmailRecord } from './types/email-record';
import { LoginResult } from './types/login-result';
import { ImpersonationResult } from './types/impersonation-result';
import { Login } from './types/login';
import { HookListener } from './types/hook-listener';
import { AuthenticationService } from './types/authentication-service'

export { AuthenticationService }
export { AuthenticationService as AuthService }



export { DatabaseInterface }
export { DatabaseInterface as DBInterface }

export { ConnectionInformations }
export { ConnectionInformations as ConnectionInformationsType }


// ? Tokens
export { Tokens }
export { Tokens as TokensType }

export { TokenRecord }
export { Session }
export { Session as SessionType }


// ? User
export { User }
export { User as UserObjectType }

export { CreateUser }
export { CreateUser as CreateUserType }

export { EmailRecord }


// ? Operation Results
export { LoginResult }
export { LoginResult as LoginReturnType }

export { ImpersonationResult }
export { ImpersonationResult as ImpersonateReturnType }

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
export { Login }
export { Login as LoginUserIdentityType }

export { HookListener }
