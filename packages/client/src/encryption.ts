import { HashAlgorithm, PasswordType } from '@accounts/common';
import * as isString from 'lodash/isString';
import * as CryptoJS from 'crypto-js';

const mapHashConstant = {
  sha: 'SHA',
  sha1: 'SHA1',
  sha224: 'SHA224',
  sha256: 'SHA256',
  sha384: 'SHA384',
  sha512: 'SHA512',
  md5: 'MD5',
  ripemd160: 'RIPEMD160',
};

export const hashPassword = (
  password: PasswordType,
  algorithm: HashAlgorithm
) => {
  if (isString(password)) {
    const cryptoAlgoKey = mapHashConstant[algorithm];
    const cryptoFunction = CryptoJS[cryptoAlgoKey];
    return {
      digest: cryptoFunction(password).toString(),
      algorithm,
    };
  }

  // Prehashed password object
  return password;
};
