export const User = {
  email: (root, args, { user }) => user.emails[0].address,
};
