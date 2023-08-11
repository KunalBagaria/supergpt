import { useEffect, useState, useContext, createContext } from 'react';
import { User } from '@/lib/interfaces';

export const UserContext = createContext<User | null>(null);

export const UserProvider = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (user === null) {
      const interval = setInterval(() => {
        if (user !== null) return;
        const localUser = localStorage.getItem('user');
        if (localUser && typeof localUser === 'string') {
          const parsedUser = JSON.parse(localUser);
          console.log(
            'User found in local storage. Setting user to:',
            parsedUser
          );
          setUser(parsedUser);
        }
      }, 100);
      return () => clearInterval(interval);
    }
  }, [user]);

  return (
    <UserContext.Provider value={user}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);