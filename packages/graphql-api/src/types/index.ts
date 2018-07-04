import { User } from '@accounts/types';

export interface IResolverContext {
  user: User;
  authToken: string;
  userAgent: string;
  ip: string;
}
