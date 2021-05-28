import { useDisclosure } from '@chakra-ui/hooks';
import {
    Badge,
    Box,
    Center,
    Divider,
    Flex,
    Heading,
    List,
    ListItem,
    Text
} from '@chakra-ui/layout';
import React, { useContext, useEffect, useState } from 'react';
import { ToContext } from '../context/ActiveRoomProvider';
import { SocketContext } from '../context/SocketProvider';

const rooms = [
  { roomName: 'General' },
  { roomName: 'Sports' },
  { roomName: 'Science' },
  { roomName: 'Health' },
  { roomName: 'Finance' },
];

const ChatRooms = () => {
  //need to query users
  const socket = useContext(SocketContext);
  const [to, setCurrentTo] = useContext(ToContext);
  const { isOpen, onToggle, onClose } = useDisclosure();
  const [alertMsg, setAlertMsg] = useState('xxx has just joined the chat');

  useEffect(() => {
    socket.on('change room', (room: string) => {
      setCurrentTo(room);
    });
    return () => {
      socket.off('change room');
    };
  }, [to]);

  return (
    <>
      <Flex
        direction='column'
        bg='gray.700'
        rounded={10}
        minHeight='100%'
        ml={5}
      >
        <Box mb={5}>
          {' '}
          <Center>
            {' '}
            <Heading color='teal' size='lg'>
              Chat Rooms
            </Heading>
          </Center>
        </Box>
        <Box>
          <List>
            {rooms.map((room) => {
              return (
                <div
                  key={room.roomName}
                  onClick={() => {
                    socket.emit('change room', room.roomName);
                  }}
                >
                  <Flex direction='row' justify='space-between' width='100%'>
                    <Box>
                      <ListItem p={3} mb={1}>
                        <Text fontSize='xl'>
                          {room.roomName}{' '}
                          {to === room.roomName ? (
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
                    <Center mr={5}></Center>
                  </Flex>
                  <Divider />
                </div>
              );
            })}
          </List>
        </Box>
        <Divider></Divider>
      </Flex>
    </>
  );
};

export default ChatRooms;
