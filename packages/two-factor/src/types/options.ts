import { ErrorMessages } from './error-messages';

export interface AccountsTwoFactorOptions {
  /**
   * Two factor app name
   */
  appName?: string;
  /**
   * Two factor secret length, default to 20
   */
  secretLength?: number;
  window?: number;
  /**
   * Two factor module errors
   */
  errors?: ErrorMessages;
}
