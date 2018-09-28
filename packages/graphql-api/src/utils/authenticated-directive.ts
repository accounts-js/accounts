import { authenticated } from './authenticated-resolver';
import { SchemaDirectiveVisitor } from 'graphql-tools';

export const createAuthenticatedDirective: any = () => {
  return class AuthenticatedDirective extends SchemaDirectiveVisitor {
    public visitFieldDefinition(field: any) {
      field.resolve = authenticated(field.resolve);
    }
    public visitObject(object: any) {
      const fields = object.getFields();
      Object.keys(fields).forEach((key: any) => {
        fields[key].resolve = authenticated(fields[key].resolve);
      });
    }
  };
};
