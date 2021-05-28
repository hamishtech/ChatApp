import { Button } from '@chakra-ui/button';
import { Center, Flex } from '@chakra-ui/layout';
import { Textarea } from '@chakra-ui/textarea';
import React, { useContext, useState } from 'react';
import { ToContext } from '../context/ActiveRoomProvider';
import { SocketContext } from '../context/SocketProvider';
import { UserContext } from '../context/UserProvider';

interface Chat {
  message: string;
  from: string;
}

interface Message {
  content: Chat;
  to: string;
}

const ChatInput = () => {
  const [message, setMessage] = useState('');
  const socket = useContext(SocketContext);
  const [user] = useContext(UserContext);
  const [to] = useContext(ToContext);

  const handleSubmit = () => {
    const msg: Message = {
      content: { message, from: user.username },
      to,
    };
    setMessage('');
    return socket.emit('newMsg', msg);
  };

  return (
    <Flex height='100%' rounded={5} p={3}>
      <Textarea
        bg='gray.700'
        height='100%'
        type='text'
        placeholder='Insert message here....'
        fontSize='xl'
        value={message}
        onChange={(e) => {
          setMessage(e.currentTarget.value);
        }}
      ></Textarea>
      <Center p={5}>
        {' '}
        <Button type='submit' colorScheme='teal' onClick={handleSubmit}>
          Submit
        </Button>
      </Center>
    </Flex>
  );
};

export default ChatInput;
