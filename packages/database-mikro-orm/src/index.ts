import { AccountsMikroOrm } from './mikro-orm';
import { IUser, getUserSchema, UserCtorArgs, getUserCtor } from './entity/User';
import { Email, getEmailSchema, EmailCtorArgs, EmailCtor } from './entity/Email';
import { Service, getServiceSchema, ServiceCtorArgs, ServiceCtor } from './entity/Service';
import { Session, getSessionSchema, SessionCtorArgs } from './entity/Session';

const getCtors = ({
  EmailEntity = Email,
  ServiceEntity = Service,
}: {
  EmailEntity?: EmailCtor<any>;
  ServiceEntity?: ServiceCtor<any>;
} = {}) => [getUserCtor({ EmailEntity, ServiceEntity }), Email, Service, Session];
const schemas = [getUserSchema, getEmailSchema, getServiceSchema, getSessionSchema];

export {
  AccountsMikroOrm,
  IUser,
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
  getUserCtor,
  getCtors,
  schemas,
};
export default AccountsMikroOrm;
