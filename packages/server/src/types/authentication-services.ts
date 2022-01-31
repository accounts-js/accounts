import { AuthenticationService, User } from '@accounts/types';

export interface AuthenticationServices<CustomUser extends User = User> {
  [key: string]:
    | (new (args: any) => AuthenticationService<CustomUser>)
    | AuthenticationService<CustomUser>
    | undefined;
}
