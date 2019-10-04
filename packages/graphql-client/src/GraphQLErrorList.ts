import { GraphQLError } from 'graphql';

export class GraphQLErrorList extends Error {
  public errors: readonly GraphQLError[];

  constructor(errors: readonly GraphQLError[], message?: string) {
    super();
    this.errors = errors;
    this.stack = new Error().stack;

    const br = '\r\n';
    const summary = `${errors.length} error${errors.length > 1 ? 's' : ''}${
      message ? ' ' + message : ':'
    }`;
    const errList = errors.map(err => `\t- ${err.message}`).join(br);
    this.message = `GraphQLErrorList - ${summary}${br}${errList}`;
  }

  toString() {
    return this.errors.map(err => err.toString()).join('\r\n');
  }
}
