import React, { useEffect, useState } from 'react';
import { User } from '@accounts/types';
import { accountsClient } from '../accounts';

const AuthContext = React.createContext<{ user?: User; fetchUser: () => Promise<void> }>({
  fetchUser: async () => {},
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

  useEffect(() => {
    fetchUser();
  }, []);

  // If we need to refresh the tokens, it will show a fullscreen loader
  if (state.loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ user: state.user, fetchUser }}>{children}</AuthContext.Provider>
  );
};

const useAuth = () => React.useContext(AuthContext);

export { AuthProvider, useAuth };
