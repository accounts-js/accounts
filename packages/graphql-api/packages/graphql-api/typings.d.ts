declare module '@accounts/graphql-api' {
  export interface SchemaGenerationResult {
    schema: string;
    extendWithResolvers: (resolversObject: any) => any;
  }

  export interface SchemaGenerationOptions {
    rootQueryName: string;
    rootMutationName: string;
    extend: boolean;
    withSchemaDefinition: boolean;
  }

  export function createJSAccountsGraphQL(AccountsServer: any, options?: SchemaGenerationOptions): SchemaGenerationResult;

  export function JSAccountsContext(request: any, headerName?: string): any;
  export function authenticated(AccountsServer: any, resolver?: Function): any;
}