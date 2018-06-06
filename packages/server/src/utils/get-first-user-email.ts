import { includes } from 'lodash';
import { EmailRecord, User } from '@accounts/types';

export function getFirstUserEmail(user: User, address: string): string {
  // Pick the first email if we weren't passed an email
  if (!address && user.emails && user.emails[0]) {
    address = user.emails[0].address;
  }
  // Make sure the address is valid
  const emails = user.emails || [];
  if (!address || !includes(emails.map((email: EmailRecord) => email.address), address)) {
    throw new Error('No such email address for user');
  }
  return address;
}
