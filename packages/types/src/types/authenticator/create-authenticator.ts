export interface CreateAuthenticator {
  type: string;
  userId: string;
  active: boolean;
  [additionalKey: string]: any;
}
