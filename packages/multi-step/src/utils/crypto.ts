import * as crypto from 'crypto';
import { User } from '@accounts/types';

export function createServiceId(user: User): string {
  const hash = crypto.createHash('sha256');

  hash.update(user.id);

  return hash.digest('hex');
}

export function createToken(): { token: string; hash: string } {
  const randomToken = crypto.randomBytes(16).toString('base64');

  const hash = crypto.createHash('sha256');

  hash.update(randomToken);

  return {
    token: randomToken,
    hash: hash.digest('base64'),
  };
}

export function validateToken(token: string, hashToken: string): boolean {
  const hash = crypto.createHash('sha256');

  hash.update(token);

  return hash.digest('base64') === hashToken;
}
