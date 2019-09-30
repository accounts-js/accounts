export interface CreateUser {
  username?: string;
  email?: string;
  mfaChallenges?: string[];
  [additionalKey: string]: any;
}
