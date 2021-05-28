import { Box, Flex, Heading, Stack, Text } from '@chakra-ui/layout';
import React, { useContext, useEffect, useState } from 'react';
import { ToContext } from '../context/ActiveRoomProvider';
import { SocketContext } from '../context/SocketProvider';
import { UserContext } from '../context/UserProvider';

interface Chat {
  message: string;
  from: string;
}

// eslint-disable-next-line react/prop-types
function Feature({
  username,
  msg,
  color,
  ...rest
}: {
  username: string;
  color: string;
  msg: string;
}) {
  return (
    <Box
      p={5}
      shadow='dark-lg'
      {...rest}
      justifySelf='right'
      maxW='40%'
      bg='black.500'
      rounded={25}
    >
      <Heading color={color} fontSize='xl'>
        {username}
      </Heading>
      <Text fontSize='2xl' mt={4}>
        {msg}
      </Text>
    </Box>
  );
}

const ChatArea = () => {
  const [user] = useContext(UserContext);
  const [to] = useContext(ToContext);
  const socket = useContext(SocketContext);
  const [chat, setChat] = useState([] as Chat[]);

  console.log(user);

  useEffect(() => {
    socket.emit('retrieve chat', { to: to });
    socket.on('retrieve chat', (chat: Chat[]) => {
      setChat(chat);
    });
    return () => {
      socket.off('retrieve chat');
    };
  }, [to]);

  useEffect(() => {
    socket.on('newMsg', (msg: Chat[]) => {
      setChat(msg);
    });
    // socket.on('roomJoin', (msg: { username: string; room: string }) => {
    //   setActiveRoom(msg.room);
    //   setNotif({ status: true, msg: `${msg.username} has joined the room` });
    //   setTimeout(() => {
    //     setNotif({
    //       status: false,
    //       msg: '',
    //     });
    //   }, 5000);
    // });

    socket.on('room join msgs', (msg: Chat[]) => {
      setChat(msg);
    });

    return () => {
      socket.off('newMsg');
      socket.off('typing');
    };
  }, [chat]);

  return (
    <Flex
      border='solid'
      rounded={5}
      ml={7}
      direction='column'
      p={3}
      minHeight='100%'
      w='85%'
    >
      <Stack spacing={8}>
        {chat
          ? chat.map((chat) => {
              return (
                <Flex
                  key={chat.message}
                  justifyContent={
                    chat.from === user.username ? 'flex-end' : 'flex-start'
                  }
                >
                  <Feature
                    username={chat.from}
                    msg={chat.message}
                    color={chat.from === user.username ? 'green' : 'teal'}
                  />
                </Flex>
              );
            })
          : null}
      </Stack>
    </Flex>
  );
};

export default ChatArea;
