import { User } from '@accounts/types';

interface IResolverContext {
  user: User;
  authToken: string;
  userAgent: string;
  ip: string;
}
