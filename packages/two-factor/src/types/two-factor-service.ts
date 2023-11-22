import { type GeneratedSecret } from '@levminer/speakeasy';

export interface TwoFactorService {
  secret: GeneratedSecret;
}
