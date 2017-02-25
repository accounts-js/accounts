export const User = {
  id: user => user.id || user._id,
  email: user => user.emails[0].address,
};
