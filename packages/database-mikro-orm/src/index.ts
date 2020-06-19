import { AccountsMikroOrm } from './mikro-orm';
import { User, getUserSchema, UserCtorArgs } from './entity/User';
import { Email, getEmailSchema, EmailCtorArgs } from './entity/Email';
import { Service, getServiceSchema, ServiceCtorArgs } from './entity/Service';
import { Session, getSessionSchema, SessionCtorArgs } from './entity/Session';
import { User as IUser } from '@accounts/types/lib/types/user';

const entities = [User, Email, Service, Session];
const schemas = [getUserSchema, getEmailSchema, getServiceSchema, getSessionSchema];

export {
  AccountsMikroOrm,
  IUser,
  User,
  Email,
  Service,
  Session,
  getUserSchema,
  getEmailSchema,
  getServiceSchema,
  getSessionSchema,
  UserCtorArgs,
  EmailCtorArgs,
  ServiceCtorArgs,
  SessionCtorArgs,
  entities,
  schemas,
};
export default AccountsMikroOrm;
