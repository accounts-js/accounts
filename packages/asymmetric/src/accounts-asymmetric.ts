import * as crypto from 'crypto';

import { AuthenticationService, DatabaseInterface } from '@accounts/types';
import { AccountsServer } from '@accounts/server';
import forge from 'node-forge';

import { AsymmetricLoginType, PublicKeyType, ErrorMessages } from './types';
import { errors } from './errors';

export interface AccountsAsymmetricOptions {
  errors?: ErrorMessages;
}

const defaultOptions = {
  errors,
};

export default class AccountsAsymmetric implements AuthenticationService {
  public serviceName = 'asymmetric';
  public server!: AccountsServer;
  private db!: DatabaseInterface;
  private options: AccountsAsymmetricOptions & typeof defaultOptions;

  constructor(options: AccountsAsymmetricOptions = {}) {
    this.options = { ...defaultOptions, ...options };
  }

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
      throw new Error(this.options.errors.userNotFound);
    }

    try {
      const verify = crypto.createVerify(params.signatureAlgorithm);
      verify.write(params.payload);
      verify.end();

      const publicKeyParams: PublicKeyType = (user.services as any)[this.serviceName];

      const pemText =
        publicKeyParams.format === 'pem' ? publicKeyParams.key : this.derToPem(publicKeyParams);

      const isVerified = verify.verify(pemText, params.signature, params.signatureFormat);

      return isVerified ? user : null;
    } catch (e) {
      throw new Error(this.options.errors.verificationFailed);
    }
  }

  private derToPem(publicKeyParams: PublicKeyType): string {
    let derKey;

    switch (publicKeyParams.encoding) {
      case 'utf8': {
        derKey = forge.util.decodeUtf8(publicKeyParams.key);
        break;
      }
      case 'hex': {
        derKey = forge.util.hexToBytes(publicKeyParams.key);
        break;
      }
      case 'base64':
      default: {
        derKey = forge.util.decode64(publicKeyParams.key);
        break;
      }
    }

    const asnObj = forge.asn1.fromDer(derKey);
    const publicKey = forge.pki.publicKeyFromAsn1(asnObj);
    return forge.pki.publicKeyToPem(publicKey);
  }
}
