export interface CreateAuthenticator {
  type: string;
  userId: string;
  [additionalKey: string]: any;
}
