// @flow
import type UserObjectType from '../common/UserObjectType';

export interface DBDriverInterface {
  findUserByEmail(email: string): Promise<?UserObjectType>,
  findUserByUsername(username: string): Promise<?UserObjectType>,
  createUser(user: UserObjectType): Promise<string>
}

class DBDriver {

}

export default DBDriver;
