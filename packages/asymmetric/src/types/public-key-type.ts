export interface PublicKeyType {
  key: string;
  encoding: 'utf8' | 'base64' | 'hex';
  format: 'pem' | 'der';
  type: 'pkcs1' | 'spki';
}
