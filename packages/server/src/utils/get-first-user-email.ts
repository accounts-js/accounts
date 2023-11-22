import { type User } from '@accounts/types';

export function getFirstUserEmail(user: User, address: string): string {
  // Pick the first email if we weren't passed an email
  if (!address) {
    if (user.emails && user.emails[0]) {
      address = user.emails[0].address;
    } else {
      throw new Error("User doesn't have an email address");
    }
  }

  const validAddresses = user.emails?.map((email) => email.address) ?? [];
  const addressIsValid = validAddresses.includes(address);
  if (!addressIsValid) {
    throw new Error('No such email address for user');
  }

  return address;
}
