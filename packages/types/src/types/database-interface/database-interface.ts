import { User } from '../user';
import { CreateUser } from '../create-user';
import { DatabaseInterfaceSessions } from './sessions';
import { DatabaseInterfacePassword } from './password';

export interface DatabaseInterface extends DatabaseInterfaceSessions, DatabaseInterfacePassword {
  // Find user by identity fields
  findUserByEmail(email: string): Promise<User | null>;

  findUserByUsername(username: string): Promise<User | null>;

  findUserById(userId: string): Promise<User | null>;

  // Create and update users
  createUser(user: CreateUser): Promise<string>;

  setUsername(userId: string, newUsername: string): Promise<void>;

  // Auth services related operations
  findUserByServiceId(serviceName: string, serviceId: string): Promise<User | null>;

  setService(userId: string, serviceName: string, data: object): Promise<void>;

  unsetService(userId: string, serviceName: string): Promise<void>;

  setUserDeactivated(userId: string, deactivated: boolean): Promise<void>;
}
