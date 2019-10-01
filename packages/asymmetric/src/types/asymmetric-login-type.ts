export interface AsymmetricLoginType {
  publicKey: string;
  signature: string;
  signatureAlgorithm: 'sha256' | 'sha512';
  signatureFormat: 'hex' | 'base64';
  payload: string;
}
