import React, { useEffect, useState } from 'react';
import { User } from '@accounts/types';
import { accountsClient } from '../accounts';

const AuthContext = React.createContext<{ user?: User }>({});

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User | undefined>();

  useEffect(() => {
    const fetchUser = async () => {
      const accountsUser = await accountsClient.getUser();
      setUser(accountsUser);
      setLoading(false);
    };

    fetchUser();
  }, []);

  // If we need to refresh the tokens, it will show a fullscreen loader
  if (loading) {
    return <div>Loading...</div>;
  }

  return <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>;
};

const useAuth = () => React.useContext(AuthContext);

export { AuthProvider, useAuth };
