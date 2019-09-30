export interface MfaLoginAttempt {
  id: string;
  mfaToken: string;
  loginToken: string;
  userId: string;
}
