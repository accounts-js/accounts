import * as crypto from 'crypto';

import { CodeHash } from '../types';

export default class SimpleCodeHash implements CodeHash {
  public hash(code: string): string {
    return this._hash(code);
  }

  public verify(code: string, hash: string): boolean {
    const hashedCode = this._hash(code);

    console.log(code, hashedCode);

    return hashedCode === hash;
  }

  private _hash(code: string): string {
    const hash = crypto.createHash('sha256');
    hash.update(code);

    return hash.digest('base64');
  }
}
