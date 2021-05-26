import React, { createContext } from 'react';
import { io } from 'socket.io-client';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const SocketContext = createContext(null as any);

const SocketProvider = ({ children }: { children: JSX.Element }) => {
  const socket = io('http://localhost:8080', { autoConnect: false });
  socket.onAny((event, ...args) => {
    console.log(event, args);
  });

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export default SocketProvider;
