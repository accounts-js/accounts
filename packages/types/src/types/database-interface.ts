import { type User } from './user';
import { type DatabaseInterfaceSessions } from './session/database-interface';
import { type DatabaseInterfaceUser } from './user/database-interface';

export interface DatabaseInterface<CustomUser extends User = User>
  extends DatabaseInterfaceSessions,
    DatabaseInterfaceUser<CustomUser> {}
