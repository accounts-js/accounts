import { GraphQLError } from 'graphql';

export const authenticated =
  <
    CustomRoot,
    CustomArgs,
    CustomContext extends { skipJSAccountsVerification?: Boolean; userId?: any; user?: any },
    Info,
    ReturnType,
  >(
    func: (
      root: CustomRoot,
      args: CustomArgs,
      context: CustomContext,
      info: Info
    ) => ReturnType | Promise<ReturnType>
  ) =>
  async (root: CustomRoot, args: CustomArgs, context: CustomContext, info: Info) => {
    if (context && context.skipJSAccountsVerification === true) {
      return func(root, args, context, info);
    }
    if (!context.userId && !context.user) {
      throw new GraphQLError('Unauthorized', {
        extensions: {
          code: 'UNAUTHENTICATED',
          http: { status: 401 },
        },
      });
    }
    return func(root, args, context, info);
  };
