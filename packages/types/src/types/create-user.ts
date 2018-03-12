export interface CreateUser {
  username?: string;
  email?: string;
  profile?: object;
  [additionalKey: string]: any;
}