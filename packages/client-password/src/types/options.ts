export interface AccountsClientPasswordOptions {
  /**
   * Use this option if you want to customize the hashing method.
   * By default accounts-js will hash the password using SHA256.
   */
  hashPassword?(password: string): string;
}
