import { LoginResultResolvers, UserResolvers } from '../../../models';

//FIXME: remove me
export const User: UserResolvers = {
  username(user, args, ctx) {
    return user.username ?? null;
  },
};

//FIXME: remove me
export const LoginResult: LoginResultResolvers = {
  user(loginResult, args, ctx) {
    console.log('LoginResultResolvers');
    console.log(loginResult.user);
    return loginResult.user ?? null;
  },
};
