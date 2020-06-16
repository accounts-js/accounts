import { CreateAuthenticator } from '../authenticator/create-authenticator';
import { Authenticator } from '../authenticator/authenticator';

export interface DatabaseInterfaceAuthenticators {
  createAuthenticator(authenticator: CreateAuthenticator): Promise<string>;

  findAuthenticatorById(authenticatorId: string): Promise<Authenticator | null>;

  findUserAuthenticators(userId: string): Promise<Authenticator[]>;

  activateAuthenticator(authenticatorId: string): Promise<void>;

  updateAuthenticator(authenticatorId: string, data: Partial<Authenticator>): Promise<void>;
}
