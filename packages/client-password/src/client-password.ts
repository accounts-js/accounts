import { AccountsClient } from '@accounts/client';

export class AccountsClientPassword {
  private client: AccountsClient;

  // TODO change any
  public async login(user: any): Promise<any> {
    const hashedPassword = this.hashPassword(user.password);
    await this.client.loginWithService('password', {
      ...user,
      password: hashedPassword,
    });
  }

  // TODO change return any
  private hashPassword(password: string): any {}
}
