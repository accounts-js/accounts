declare type RootQuery =  {
      me: ?User;
      user: ?User;
}

declare type User =  {
      id: string;
      email: ?string;
      username: ?string;
}

declare type RootMutation =  {
      createAccount: ?User;
      createAccountAndLogin: ?Token;
      loginWithPassword: ?Token;
}

declare type UserPasswordInput =  {
      email: ?string;
      username: ?string;
      password: ?string;
}

declare type Token =  {
      userId: string;
      token: string;
      tokenExpiration: number;
}

declare module CreateUserMutation {
    declare type Variables = {
      user: UserPasswordInput;
    }

    declare type CreateAccountAndLogin = {
      token: string;
      tokenExpiration: number;
      userId: string;
    }

    declare type Result = {
      createAccountAndLogin: CreateAccountAndLogin;
    }

}

declare module LoginMutation {
    declare type Variables = {
      user: UserPasswordInput;
    }

    declare type LoginWithPassword = {
      userId: string;
      token: string;
      tokenExpiration: number;
    }

    declare type Result = {
      loginWithPassword: LoginWithPassword;
    }

}

