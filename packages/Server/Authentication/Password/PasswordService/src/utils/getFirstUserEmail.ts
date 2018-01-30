import { EmailRecord, User } from 'accounts';


export const getFirstUserEmail = ( user: User, address: string ): string => {

	// Pick the first email if we weren't passed an email
	if (!address && user.emails && user.emails[0]) {
		address = user.emails[0].address;
	}

	if(!address) throw new Error('No such email address for user');

	// Make sure the address is valid
	const userEmailRecords: EmailRecord[] = user.emails || [];

	const userEmails = userEmailRecords.map( (email: EmailRecord) => email.address );

	const doAddressBelongsToUser = userEmails.includes(address);

	if(!doAddressBelongsToUser) throw new Error('The address does not belongs to the user');

	return address;

}
