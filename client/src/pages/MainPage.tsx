import { Grid, GridItem } from '@chakra-ui/layout';
import React from 'react';
import ChatArea from '../components/ChatArea';
import ChatInput from '../components/ChatInput';
import ChatRooms from '../components/ChatRooms';
import OnlineUsers from '../components/OnlineUsers';

const MainPage = () => {
  return (
    <div>
      <Grid
        mt={10}
        h='90vh'
        templateRows='repeat(4, 1fr)'
        templateColumns='repeat(5, 1fr)'
        gap={4}
      >
        <GridItem rowSpan={2} colSpan={1} overflowY='scroll'>
          <ChatRooms />
        </GridItem>
        <GridItem colSpan={4} rowSpan={3} overflowY='scroll'>
          <ChatArea />
        </GridItem>
        <GridItem rowSpan={2} colSpan={1} overflowY='scroll'>
          <OnlineUsers />
        </GridItem>
        <GridItem colSpan={4} rowSpan={1} overflowY='scroll'>
          <ChatInput />
        </GridItem>
      </Grid>
    </div>
  );
};

export default MainPage;
