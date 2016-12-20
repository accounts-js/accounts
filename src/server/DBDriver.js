// @flow
import type UserObjectType from '../common/UserObjectType';

export interface DBDriverInterface {
  findUserByEmail(email: string): Promise<UserObjectType> | Promise<null>,
  findUserByUsername(username: string): Promise<UserObjectType> | Promise<null>,
  createUser(user: UserObjectType): Promise<string>
}

class DBDriver {

}

export default DBDriver;
