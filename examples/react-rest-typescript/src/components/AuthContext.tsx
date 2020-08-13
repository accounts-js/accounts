import React, { useEffect, useState } from 'react';
import { User, AuthenticationResult } from '@accounts/types';
import { accountsClient } from '../accounts';

const AuthContext = React.createContext<{
  user?: User;
  fetchUser: () => Promise<void>;
  loginWithService: (service: string, credentials: any) => Promise<AuthenticationResult>;
  logout: () => Promise<void>;
}>({
  fetchUser: async () => {},
  loginWithService: async () => {
    // Just to fix ts typechecking
    return null as any;
  },
  logout: async () => {},
});

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [state, setState] = useState<{ user?: User; loading: boolean }>({ loading: true });

  const fetchUser = async () => {
    const accountsUser = await accountsClient.getUser();
    setState({ loading: false, user: accountsUser });
  };

  const loginWithService = async (service: string, credentials: any) => {
    const loginResponse = await accountsClient.loginWithService(service, credentials);
    if ('tokens' in loginResponse) {
      await fetchUser();
    }
    return loginResponse;
  };

  const logout = async () => {
    await accountsClient.logout();
    setState({ loading: false, user: undefined });
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // If we need to refresh the tokens, it will show a fullscreen loader
  if (state.loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ user: state.user, fetchUser, loginWithService, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => React.useContext(AuthContext);

export { AuthProvider, useAuth };
