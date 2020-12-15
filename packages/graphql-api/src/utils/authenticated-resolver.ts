export const authenticated = <CustomRoot, CustomArgs, Context, Info, T>(
  func: (root: CustomRoot, args: CustomArgs, context: Context, info: Info) => T | Promise<T>
) => async (root: CustomRoot, args: CustomArgs, context: Context, info: Info) => {
  if (context && context.skipJSAccountsVerification === true) {
    return func(root, args, context, info);
  }
  if (!context.userId && !context.user) {
    throw new Error('Unauthorized');
  }
  return func(root, args, context, info);
};
