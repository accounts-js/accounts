import * as crypto from 'crypto';

import { PublicKeyType } from '../src/types';
import { AccountsAsymmetric } from '../src';

describe('AccountsAsymmetric', () => {
  it('a', async () => {
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
