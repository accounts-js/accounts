import * as includes from 'lodash/includes';
import { UserObjectType, AccountsError, EmailRecord } from '@accounts/common';

export function getFirstUserEmail(user: UserObjectType, address: string): string {
  // Pick the first email if we weren't passed an email
  if (!address && user.emails && user.emails[0]) {
    address = user.emails[0].address;
  }
  // Make sure the address is valid
  const emails = user.emails || [];
  if (
    !address ||
    !includes(emails.map((email: EmailRecord) => email.address), address)
  ) {
    throw new AccountsError('No such email address for user');
  }
  return address;
}
