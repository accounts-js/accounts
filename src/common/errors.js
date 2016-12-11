import { createError } from 'apollo-errors';

const AccountsError = createError('AccountsError', {});

// eslint-disable-next-line prefer-default
export { AccountsError };
