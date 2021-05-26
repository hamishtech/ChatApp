import React, { createContext, useState } from 'react';

interface User {
  name?: string;
}

const user: User = { name: '' };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const UserContext = createContext(user as any);

const UserProvider = ({ children }: { children: JSX.Element }) => {
  const [currentUser, setUser] = useState(user);
  return (
    <UserContext.Provider value={[currentUser, setUser]}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
