import { createError } from 'apollo-errors';

const AccountsError = createError('AccountsError', {});

// eslint-disable-next-line import/prefer-default-export
export { AccountsError };
