import React, { createContext, useState } from 'react';

const to = 'room1';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const ToContext = createContext(to as any);

const ToProvider = ({ children }: { children: JSX.Element }) => {
  const [currentTo, setTo] = useState(to);
  return (
    <ToContext.Provider value={[currentTo, setTo]}>
      {children}
    </ToContext.Provider>
  );
};

export default ToProvider;
