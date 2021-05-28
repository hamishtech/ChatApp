import { ChakraProvider } from '@chakra-ui/react';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import ToProvider from './context/ActiveRoomProvider';
import SocketProvider from './context/SocketProvider';
import UserListProvider from './context/UserListProvider';
import UserProvider from './context/UserProvider';
import './index.css';
import theme from './theme';

ReactDOM.render(
  <React.StrictMode>
    <SocketProvider>
      <UserListProvider>
        <UserProvider>
          <ToProvider>
            <ChakraProvider theme={theme}>
              <App />
            </ChakraProvider>
          </ToProvider>
        </UserProvider>
      </UserListProvider>
    </SocketProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
