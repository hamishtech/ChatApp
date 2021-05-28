import { Alert, AlertIcon } from '@chakra-ui/alert';
import { Button, IconButton } from '@chakra-ui/button';
import { useDisclosure } from '@chakra-ui/hooks';
import { CheckCircleIcon, EmailIcon } from '@chakra-ui/icons';
import {
    Badge,
    Box,
    Center,
    Flex,
    Heading,
    List,
    ListIcon,
    ListItem,
    Text
} from '@chakra-ui/layout';
import { Slide } from '@chakra-ui/transition';
import React, { useContext, useEffect, useState } from 'react';
import { ToContext } from '../context/ActiveRoomProvider';
import { SocketContext } from '../context/SocketProvider';
import { User, UserListContext } from '../context/UserListProvider';

interface NewUser {
  status: boolean;
  username: string;
}

interface IsTyping {
  status: boolean;
  from: string;
}

const OnlineUsers = () => {
  //need to query users
  const socket = useContext(SocketContext);
  const [users, setUsersList] = useContext(UserListContext);
  const [to, setCurrentTo] = useContext(ToContext);
  const { isOpen, onToggle, onClose } = useDisclosure();
  const [alertMsg, setAlertMsg] = useState('xxx has just joined the chat');

  console.log(users);

  useEffect(() => {
    socket.on(
      'user update',
      ({ users, newUser }: { users: User[]; newUser: NewUser }) => {
        users.forEach((user) => {
          user.self = user.userID === socket.id;
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
        onToggle();
        setAlertMsg(`${newUser.username} just joined the chat`);
        setTimeout(() => {
          onClose();
          setAlertMsg('');
        }, 2000);
      }
    );
    // socket.on('typing', (msg: IsTyping) => {
    //   return setTyping(msg);
    // });
    return () => {
      socket.off('user update');
      socket.off('typing');
    };
  }, [users]);

  return (
    <>
      <Flex direction='column' bg='gray.700' rounded={10} height='100%' ml={5}>
        <Box mb={5}>
          {' '}
          <Center>
            {' '}
            <Heading color='teal' size='lg'>
              Chat Participants
            </Heading>
          </Center>
        </Box>
        <Box>
          {' '}
          <List>
            {users.map((user: User) => {
              return (
                <Flex
                  key={user.userID}
                  direction='row'
                  justify='space-between'
                  width='100%'
                >
                  <Box>
                    <ListItem p={3} mb={1}>
                      <Text fontSize='xl'>
                        {' '}
                        <ListIcon as={CheckCircleIcon} color='green.500' />
                        {user.username}
                        {to === user.userID ? (
                          <Badge
                            ml='1'
                            variant='outline'
                            fontSize='0.8em'
                            colorScheme='green'
                          >
                            {' '}
                            Selected{' '}
                          </Badge>
                        ) : null}
                      </Text>
                    </ListItem>
                  </Box>
                  <Center mr={5}>
                    <IconButton
                      variant='outline'
                      colorScheme='teal'
                      aria-label='Send email'
                      icon={<EmailIcon />}
                      onClick={() => {
                        setCurrentTo(user.userID);
                        socket.emit('change room', to);
                      }}
                    />{' '}
                  </Center>
                </Flex>
              );
            })}
          </List>
        </Box>
      </Flex>
      <Slide direction='top' in={isOpen} style={{ zIndex: 15 }}>
        <Center>
          {' '}
          <Alert status='success'>
            <AlertIcon />
            {alertMsg}
          </Alert>
        </Center>
      </Slide>
      <Button onClick={onToggle}>Online user </Button>
    </>
  );
};

export default OnlineUsers;
