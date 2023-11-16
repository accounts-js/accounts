import AccountsPassword, { AccountsPasswordOptions } from './accounts-password';
export * from './types';
export * from './endpoints';
export {
  AddEmailErrors,
  ChangePasswordErrors,
  CreateUserErrors,
  ResetPasswordErrors,
  SendVerificationEmailErrors,
  SendResetPasswordEmailErrors,
  VerifyEmailErrors,
} from './errors';

export default AccountsPassword;
export { AccountsPassword, AccountsPasswordOptions };
