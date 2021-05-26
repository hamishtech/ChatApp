import React, { createContext, useState } from 'react';

export interface User {
  username: string;
  userID: string;
  self?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const UserListContext = createContext([] as any);

const UserProvider = ({ children }: { children: JSX.Element }) => {
  const [usersList, setUsersList] = useState([]);
  return (
    <UserListContext.Provider value={[usersList, setUsersList]}>
      {children}
    </UserListContext.Provider>
  );
};

export default UserProvider;
