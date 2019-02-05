import { authenticated } from './authenticated-resolver';
import { SchemaDirectiveVisitor } from 'graphql-tools';
export class AuthenticatedDirective extends SchemaDirectiveVisitor {
  public visitFieldDefinition(field: any) {
    field.resolve = authenticated(field.resolve);
  }
  public visitObject(object: any) {
    const fields = object.getFields();
    // tslint:disable-next-line:forin
    for (const fieldName in fields) {
      const field = fields[fieldName];
      if ('resolve' in field) {
        field.resolve = authenticated(field.resolve);
      }
    }
  }
}
