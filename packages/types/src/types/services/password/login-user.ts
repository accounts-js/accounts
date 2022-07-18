import { LoginUserIdentity } from '../../login-user-identity';

export interface LoginUserPasswordService {
  user: string | LoginUserIdentity;
  password: string;
  receiveOther: boolean
  receiveFastep: boolean
  certifyAge: boolean
  readTerms: boolean
  allSelect: boolean
  // 2FA code
  code?: string;
}
