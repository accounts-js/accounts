export const User = {
  id: user => user.id || user._id,
  email: user => user.emails && user.emails[0] && user.emails[0].address,
};
