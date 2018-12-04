export const User = {
  id: (user: any) => {
    // In the case of Mongo
    if (user._id) {
      return user._id.toString();
    }
    return user.id.toString();
  },
};
