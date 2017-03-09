// @flow
import type { HashAlgorithm } from '@accounts/common';
import CryptoJS from 'crypto-js';

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

export const hashPassword = (password: string, algorithm: HashAlgorithm) => {
  const cryptoAlgoKey = mapHashConstant[algorithm];
  const cryptoFunction = CryptoJS[cryptoAlgoKey];
  return cryptoFunction(password).toString();
};
