import { authenticated } from './authenticated-resolver';
import { SchemaDirectiveVisitor } from 'graphql-tools';
export class AuthenticatedDirective extends SchemaDirectiveVisitor {
  public visitFieldDefinition(field: any) {
    field.resolve = authenticated(field.resolve);
  }
  public visitObject(object: any) {
    const fields = object.getFields();
    Object.keys(fields).forEach((fieldName) => {
      const field = fields[fieldName];
      if ('resolve' in field) {
        field.resolve = authenticated(field.resolve);
      }
    });
  }
}
