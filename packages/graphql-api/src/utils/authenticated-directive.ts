import { authenticated } from './authenticated-resolver';
import { SchemaDirectiveVisitor } from 'graphql-tools';
import { AccountsServer } from '@accounts/server';

export const createAuthenticatedDirective: any = (accounts: AccountsServer) => {
  return class AuthenticatedDirective extends SchemaDirectiveVisitor {
    public visitFieldDefinition(field: any) {
      field.resolve = authenticated(accounts, field.resolve);
    }
    public visitObject(object: any) {
      const fields = object.getFields();
      Object.keys(fields).forEach((key: any) => {
        fields[key].resolve = authenticated(accounts, fields[key].resolve);
      });
    }
  };
};
