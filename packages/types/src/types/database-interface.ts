import { User } from './user';
import { DatabaseInterfaceSessions } from './session/database-interface';
import { DatabaseInterfaceUser } from './user/database-interface';

export interface DatabaseInterface<CustomUser extends User = User>
  extends DatabaseInterfaceSessions,
    DatabaseInterfaceUser<CustomUser> {}
