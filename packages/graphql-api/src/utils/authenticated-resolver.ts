export const authenticated = (func: any) => async (
  root: any,
  args: any,
  context: any,
  info: any
) => {
  if (context && context.skipJSAccountsVerification === true) {
    return func(root, args, context, info);
  }
  if (!context.userId && !context.user) {
    throw new Error('Unauthorized');
  }
  return func(root, args, context, info);
};
