import { GraphQLSchema } from 'graphql';
import { ApplicationConfig } from 'graphql-modules';
import { authDirective } from './authenticated-directive';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { mergeResolvers, mergeTypeDefs } from '@graphql-tools/merge';
import { IResolvers, Maybe, TypeSource } from '@graphql-tools/utils';

export const buildSchema =
  <TSource, TContext>({
    typeDefs,
    resolvers,
    authDirective: { authDirectiveTypeDefs, authDirectiveTransformer } = authDirective('auth'),
  }: {
    typeDefs?: TypeSource;
    resolvers?:
      | Maybe<IResolvers<TSource, TContext>>
      | Maybe<Maybe<IResolvers<TSource, TContext>>[]>;
    authDirective?: {
      authDirectiveTypeDefs: string;
      authDirectiveTransformer: (schema: GraphQLSchema) => GraphQLSchema;
    };
  } = {}): ApplicationConfig['schemaBuilder'] =>
  ({ typeDefs: accountsTypeDefs, resolvers: accountsResolvers }) =>
    authDirectiveTransformer(
      makeExecutableSchema({
        typeDefs: mergeTypeDefs([
          ...accountsTypeDefs,
          ...(typeDefs ? [typeDefs] : []),
          authDirectiveTypeDefs,
        ]),
        resolvers: resolvers
          ? mergeResolvers([resolvers, ...accountsResolvers] as Maybe<Maybe<IResolvers<TSource, TContext>>[]>)
          : accountsResolvers,
      })
    );
