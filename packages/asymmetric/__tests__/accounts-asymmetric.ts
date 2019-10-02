import * as crypto from 'crypto';

import { PublicKeyType } from '../src/types';
import { AccountsAsymmetric } from '../src';

describe('AccountsAsymmetric', () => {
  it('should update the public key', async () => {
    const { publicKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength: 512,
      publicKeyEncoding: {
        type: 'pkcs1',
        format: 'pem',
      },
      privateKeyEncoding: {
        type: 'pkcs1',
        format: 'pem',
      },
    });

    const service = new AccountsAsymmetric();

    const setService = jest.fn(() => Promise.resolve(null));
    service.setStore({ setService } as any);

    const publicKeyParams: PublicKeyType = {
      key: publicKey,
      encoding: 'base64',
      format: 'pem',
      type: 'spki',
    };

    const res = await service.updatePublicKey('123', publicKeyParams);

    expect(res).toBeTruthy();
    expect(setService).toHaveBeenCalledWith('123', service.serviceName, {
      id: publicKey,
      ...publicKeyParams,
    });
  });

  it('throws error when the user is not found by public key', async () => {
    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength: 512,
      publicKeyEncoding: {
        type: 'pkcs1',
        format: 'pem',
      },
      privateKeyEncoding: {
        type: 'pkcs1',
        format: 'pem',
      },
    });
    const payload = 'some data to sign';

    const sign = crypto.createSign('SHA256');
    sign.write(payload);
    sign.end();
    const signature = sign.sign(privateKey, 'hex');

    const service = new AccountsAsymmetric();

    const findUserByServiceId = jest.fn(() => Promise.resolve(null));
    service.setStore({ findUserByServiceId } as any);

    await expect(
      service.authenticate({
        signature,
        payload,
        publicKey,
        signatureAlgorithm: 'sha512',
        signatureFormat: 'hex',
      })
    ).rejects.toMatchSnapshot();
  });

  it('should return null when signature is invalid', async () => {
    const { publicKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength: 512,
      publicKeyEncoding: {
        type: 'pkcs1',
        format: 'pem',
      },
      privateKeyEncoding: {
        type: 'pkcs1',
        format: 'pem',
      },
    });
    const payload = 'some data to sign';

    const service = new AccountsAsymmetric();

    const publicKeyParams: PublicKeyType = {
      key: publicKey,
      encoding: 'base64',
      format: 'pem',
      type: 'pkcs1',
    };

    const user = {
      id: '123',
      services: {
        [service.serviceName]: publicKeyParams,
      },
    };
    const findUserByServiceId = jest.fn(() => Promise.resolve(user));
    service.setStore({ findUserByServiceId } as any);

    const userFromService = await service.authenticate({
      signature: 'some signature',
      payload,
      publicKey: publicKey,
      signatureAlgorithm: 'sha256',
      signatureFormat: 'hex',
    });

    expect(userFromService).toBeNull();
  });

  it('should return user when verification is successful', async () => {
    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength: 512,
      publicKeyEncoding: {
        type: 'pkcs1',
        format: 'pem',
      },
      privateKeyEncoding: {
        type: 'pkcs1',
        format: 'pem',
      },
    });
    const payload = 'some data to sign';

    const sign = crypto.createSign('sha256');
    sign.write(payload);
    sign.end();
    const signature = sign.sign(privateKey, 'hex');

    const service = new AccountsAsymmetric();

    const publicKeyParams: PublicKeyType = {
      key: publicKey,
      encoding: 'base64',
      format: 'pem',
      type: 'pkcs1',
    };

    const user = {
      id: '123',
      services: {
        [service.serviceName]: publicKeyParams,
      },
    };
    const findUserByServiceId = jest.fn(() => Promise.resolve(user));
    service.setStore({ findUserByServiceId } as any);

    const userFromService = await service.authenticate({
      signature,
      payload,
      publicKey: publicKey,
      signatureAlgorithm: 'sha256',
      signatureFormat: 'hex',
    });

    expect(userFromService).toEqual(user);
  });

  it('should return user when verification is successful using der format', async () => {
    const { publicKey: publicKeyBuffer, privateKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength: 512,
      publicKeyEncoding: {
        type: 'pkcs1',
        format: 'der',
      },
      privateKeyEncoding: {
        type: 'pkcs1',
        format: 'pem',
      },
    });
    const publicKey = publicKeyBuffer.toString('base64');
    const payload = 'some data to sign';

    const sign = crypto.createSign('sha256');
    sign.write(payload);
    sign.end();
    const signature = sign.sign(privateKey, 'hex');

    const service = new AccountsAsymmetric();

    const publicKeyParams: PublicKeyType = {
      key: publicKey,
      encoding: 'base64',
      format: 'der',
      type: 'pkcs1',
    };

    const user = {
      id: '123',
      services: {
        [service.serviceName]: publicKeyParams,
      },
    };
    const findUserByServiceId = jest.fn(() => Promise.resolve(user));
    service.setStore({ findUserByServiceId } as any);

    const userFromService = await service.authenticate({
      signature,
      payload,
      publicKey,
      signatureAlgorithm: 'sha256',
      signatureFormat: 'hex',
    });

    expect(userFromService).toEqual(user);
  });
});
