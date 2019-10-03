import { GraphQLError } from 'graphql';

export class GraphQLErrorList extends Error {
  public errors: readonly GraphQLError[];

  constructor(errors: readonly GraphQLError[], message?: string) {
    super();
    this.errors = errors;
    this.stack = new Error().stack;

    const br = '\r\n';
    const errList = errors.map(err => `\t- ${err.message}`).join(br);
    const additionalMsg = message ? ' ' + message : ':';
    this.message = `GraphQLErrorList - ${errors.length} errors${additionalMsg}${br}${errList}`;
  }

  toString() {
    return this.errors.map(err => err.toString()).join('\r\n');
  }
}
