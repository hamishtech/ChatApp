/* eslint-disable react/react-in-jsx-scope */
import {
  Alert,
  AlertIcon,
  Button,
  Center,
  Flex,
  Heading,
  Input,
} from '@chakra-ui/react';
import { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { SocketContext } from '../context/SocketProvider';
import { User, UserListContext } from '../context/UserListProvider';
import { UserContext } from '../context/UserProvider';

export default function SimpleCard() {
  const [, setUser] = useContext(UserContext);
  const [, setUsersList] = useContext(UserListContext);
  const socket = useContext(SocketContext);
  const [input, setInput] = useState('');
  const history = useHistory();
  const [open, setOpen] = useState(false);
  const [openError, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (input.length < 3) {
      setErrorMsg('Username should be longer than 3 letters!');
      setError(true);
      setTimeout(() => {
        setError(false);
      }, 3000);
    }
    if (input.length > 3) {
      socket.auth = { username: input };
      socket.connect();
      socket.on('connect_error', (err: ErrorEvent) => {
        setError(true);
        setErrorMsg('Could not connect!');
        setTimeout(() => {
          setError(false);
        }, 3000);

        if (err.message === 'invalid username') {
          setErrorMsg('Invalid username!');
          setError(true);
          setTimeout(() => {
            setError(false);
          }, 5000);
        }
        if (err.message === 'username !unique') {
          setErrorMsg('Username not unique!');
          setError(true);
          setTimeout(() => {
            setError(false);
          }, 5000);
        }
      });
      socket.on('users', (users: User[]) => {
        users.forEach((user) => {
          user.self = user.userID === socket.id;
          if (user.self) {
            setUser(user);
          }
        });
        const sortedUsers = users.sort((a, b) => {
          const aUsername = a.username.toUpperCase();
          const bUsername = b.username.toUpperCase();
          if (a.self) {
            return -1;
          }
          if (b.self) {
            return 1;
          }
          if (aUsername < bUsername) {
            return -1;
          }
          if (aUsername > b.username) {
            return 1;
          }
          return 0;
        });
        setUsersList(sortedUsers);
      });

      socket.on('login_success', () => {
        setOpen(true);
        setTimeout(() => {
          history.push('/chat');
        }, 2000);
      });
    }
  };

  useEffect(() => {
    return () => {
      socket.off('connect_error');
      socket.off('login_success');
      socket.off('users');
    };
  }, []);
  return (
    <div>
      <Flex
        height='100vh'
        direction='column'
        alignItems='center'
        justifyContent='center'
      >
        <Heading
          bgGradient='linear(to-l, teal,gray.200)'
          bgClip='text'
          fontWeight='extrabold'
          fontSize={{ base: '35px', md: '50px' }}
          as='h1'
          isTruncated
          mb={150}
        >
          {' '}
          Welcome to H-Chat
        </Heading>
        <Flex
          direction='column'
          background='gray.900'
          p={12}
          mb={5}
          rounded={16}
        >
          <Center>
            <Heading mb={6}>Enter username</Heading>
          </Center>
          <Input
            placeholder='your username...'
            onChange={(e) => {
              setInput(e.target.value);
            }}
            value={input}
            type='text'
            size='lg'
            mb={6}
          ></Input>
          <Button colorScheme='teal' mb={6} onClick={handleSubmit}>
            Enter
          </Button>
        </Flex>{' '}
        {open ? (
          <Center>
            <Alert status='success'>
              <AlertIcon />
              Logging in...{' '}
            </Alert>
          </Center>
        ) : null}
        {openError ? (
          <Center>
            <Alert status='error'>
              <AlertIcon />
              {errorMsg}
            </Alert>
          </Center>
        ) : null}
      </Flex>
    </div>
  );
}
