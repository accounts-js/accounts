import * as speakeasy from 'speakeasy';

export interface TwoFactorService {
  secret: speakeasy.Key;
}
