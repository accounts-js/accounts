import { User } from './user';
import { CreateUser } from './create-user';
import { DatabaseInterfaceSessions } from './session/database-interface';
import { DatabaseInterfaceServicePassword } from './services/password/database-interface';

export interface DatabaseInterface<CustomUser extends User = User>
  extends DatabaseInterfaceSessions,
    DatabaseInterfaceServicePassword<CustomUser> {
  // Find user by identity fields
  findUserById(userId: string): Promise<CustomUser | null>;

  // Create and update users
  createUser(user: CreateUser): Promise<string>;

  // Auth services related operations
  findUserByServiceId(serviceName: string, serviceId: string): Promise<CustomUser | null>;

  setService(userId: string, serviceName: string, data: object): Promise<void>;

  unsetService(userId: string, serviceName: string): Promise<void>;

  setUserDeactivated(userId: string, deactivated: boolean): Promise<void>;
}
