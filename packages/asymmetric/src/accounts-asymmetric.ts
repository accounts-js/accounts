import { AuthenticationService, DatabaseInterface } from '@accounts/types';
import { AccountsServer } from '@accounts/server';
import * as crypto from 'crypto';

import { AsymmetricLoginType, PublicKeyType } from './types';

export default class AsymmetricService implements AuthenticationService {
  public serviceName = 'asymmetric';
  public server!: AccountsServer;
  private db!: DatabaseInterface;

  public setStore(store: DatabaseInterface) {
    this.db = store;
  }

  public async updatePublicKey(
    userId: string,
    { key, ...params }: PublicKeyType
  ): Promise<boolean> {
    try {
      await this.db.setService(userId, this.serviceName, { id: key, key, ...params });
      return true;
    } catch (e) {
      return false;
    }
  }

  public async authenticate(params: AsymmetricLoginType): Promise<any> {
    const user = await this.db.findUserByServiceId(this.serviceName, params.publicKey);

    if (!user) {
      throw new Error();
    }

    try {
      const verify = crypto.createVerify(params.signatureAlgorithm);
      verify.write(params.payload);
      verify.end();

      const publicKeyParams: PublicKeyType = (user.services as any)[this.serviceName];

      const publicKey = crypto.createPublicKey({
        key: Buffer.from(publicKeyParams.key, publicKeyParams.encoding),
        format: publicKeyParams.format,
        type: publicKeyParams.type,
      });

      const isVerified = verify.verify(publicKey, params.signature, params.signatureFormat);

      return isVerified ? user : null;
    } catch (e) {
      throw new Error();
    }
  }
}
