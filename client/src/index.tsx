import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import SocketProvider from './context/SocketProvider';
import UserProvider from './context/UserProvider';
import UserListProvider from './context/UserListProvider';
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import theme from './theme';

ReactDOM.render(
  <React.StrictMode>
    <SocketProvider>
      <UserListProvider>
        <UserProvider>
          <ChakraProvider theme={theme}>
            <App />
          </ChakraProvider>
        </UserProvider>
      </UserListProvider>
    </SocketProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
