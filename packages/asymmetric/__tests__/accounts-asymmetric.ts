import * as crypto from 'crypto';

import { PublicKeyType } from '../src/types';
import { AccountsAsymmetric } from '../src';

describe('AccountsAsymmetric', () => {
  it('should update the public key', async () => {
    const { publicKey } = crypto.generateKeyPairSync('ec', {
      namedCurve: 'sect239k1',
    });
    const publicKeyStr = publicKey.export({ type: 'spki', format: 'der' }).toString('base64');

    const service = new AccountsAsymmetric();

    const setService = jest.fn(() => Promise.resolve(null));
    service.setStore({ setService } as any);

    const publicKeyParams: PublicKeyType = {
      key: publicKeyStr,
      encoding: 'base64',
      format: 'pem',
      type: 'spki',
    };

    const res = await service.updatePublicKey('123', publicKeyParams);

    expect(res).toBeTruthy();
    expect(setService).toHaveBeenCalledWith('123', service.serviceName, {
      id: publicKeyStr,
      ...publicKeyParams,
    });
  });

  it('throws error when the user is not found by public key', async () => {
    const { privateKey, publicKey } = crypto.generateKeyPairSync('ec', {
      namedCurve: 'sect239k1',
    });
    const payload = 'some data to sign';

    const sign = crypto.createSign('sha512');
    sign.write(payload);
    sign.end();
    const signature = sign.sign(privateKey, 'hex');

    const publicKeyStr = publicKey.export({ type: 'spki', format: 'der' }).toString('base64');

    const service = new AccountsAsymmetric();

    const findUserByServiceId = jest.fn(() => Promise.resolve(null));
    service.setStore({ findUserByServiceId } as any);

    await expect(
      service.authenticate({
        signature,
        payload,
        publicKey: publicKeyStr,
        signatureAlgorithm: 'sha512',
        signatureFormat: 'hex',
      })
    ).rejects.toMatchSnapshot();
  });

  it('throws error when the verification process fails', async () => {
    const { privateKey, publicKey } = crypto.generateKeyPairSync('ec', {
      namedCurve: 'sect239k1',
    });
    const payload = 'some data to sign';

    const sign = crypto.createSign('sha512');
    sign.write(payload);
    sign.end();
    const signature = sign.sign(privateKey, 'hex');

    const publicKeyStr = publicKey.export({ type: 'spki', format: 'der' }).toString('base64');

    const service = new AccountsAsymmetric();

    const publicKeyParams: PublicKeyType = {
      key: publicKeyStr,
      encoding: 'base64',
      format: 'pem',
      type: 'spki',
    };

    const user = {
      id: '123',
      services: {
        [service.serviceName]: publicKeyParams,
      },
    };
    const findUserByServiceId = jest.fn(() => Promise.resolve(user));
    service.setStore({ findUserByServiceId } as any);

    await expect(
      service.authenticate({
        signature,
        payload,
        publicKey: publicKeyStr,
        signatureAlgorithm: 'sha512',
        signatureFormat: 'hex',
      })
    ).rejects.toMatchSnapshot();
  });

  it('should return null when signature is invalid', async () => {
    const { publicKey } = crypto.generateKeyPairSync('ec', {
      namedCurve: 'sect239k1',
    });
    const payload = 'some data to sign';

    const publicKeyStr = publicKey.export({ type: 'spki', format: 'der' }).toString('base64');

    const service = new AccountsAsymmetric();

    const publicKeyParams: PublicKeyType = {
      key: publicKeyStr,
      encoding: 'base64',
      format: 'der',
      type: 'spki',
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
      publicKey: publicKeyStr,
      signatureAlgorithm: 'sha512',
      signatureFormat: 'hex',
    });

    expect(userFromService).toBeNull();
  });

  it('should return user when verification is successful', async () => {
    const { privateKey, publicKey } = crypto.generateKeyPairSync('ec', {
      namedCurve: 'sect239k1',
    });
    const payload = 'some data to sign';

    const sign = crypto.createSign('sha512');
    sign.write(payload);
    sign.end();
    const signature = sign.sign(privateKey, 'hex');

    const publicKeyStr = publicKey.export({ type: 'spki', format: 'der' }).toString('base64');

    const service = new AccountsAsymmetric();

    const publicKeyParams: PublicKeyType = {
      key: publicKeyStr,
      encoding: 'base64',
      format: 'der',
      type: 'spki',
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
      publicKey: publicKeyStr,
      signatureAlgorithm: 'sha512',
      signatureFormat: 'hex',
    });

    expect(userFromService).toEqual(user);
  });
});
