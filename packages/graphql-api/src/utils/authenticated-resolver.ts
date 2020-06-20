export const authenticated = <R, A, C, I, T>(func: (root: R, args: A, context: C, info: I) => T | Promise<T>) => async (
  root: R,
  args: A,
  context: C,
  info: I
) => {
  if (context && context.skipJSAccountsVerification === true) {
    return func(root, args, context, info);
  }
  if (!context.userId && !context.user) {
    throw new Error('Unauthorized');
  }
  return func(root, args, context, info);
};
