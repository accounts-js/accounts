import { User as UserType } from '@accounts/types';

export const User = {
  id: (user: UserType) => user.id,
  email: (user: UserType) => user.emails && user.emails[0] && user.emails[0].address,
};
