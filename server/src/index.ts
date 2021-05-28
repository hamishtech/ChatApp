import express from 'express';
import http from 'http';
import 'dotenv/config';
import router from './routes/homepage';
import morgan from 'morgan';
import cors from 'cors';
import { Message, IsTyping, User } from './types';

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('tiny'));
app.use('/', router);

let users: User[] = [
  { username: 'userone', id: 'asjasdfjadfaoi' },
  { username: 'usertwo', id: '234adksfaksldf' },
];

const chatLog: any = {};

const httpServer = http.createServer(app);
const io = require('socket.io')(httpServer, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

app.get('/api/users', (_req, res) => {
  res.json(users);
});

io.use((socket: any, next: any) => {
  const username = socket.handshake.auth.username;
  if (!username) {
    return next(new Error('invalid username'));
  }
  socket.username = username;
  next(undefined);
});

io.use((socket: any, next: any) => {
  const username = socket.handshake.auth.username;
  if (!username) {
    return next(new Error('invalid username'));
  }
  if (users.find((user) => user.username === username)) {
    return next(new Error('username !unique'));
  }
  socket.username = username;
  next();
});

io.on('connection', async (socket: any) => {
  let activeRoom = 'General';
  if (socket.username) {
    socket.emit('login_success', { activeRoom });
    const users = [];
    //loop through all connected sockets and create the list of connected sockets/users
    for (let [id, socket] of io.of('/').sockets) {
      users.push({
        userID: id,
        username: socket.username,
      });
      socket.emit('users', users);
      socket.broadcast.emit('user update', {
        users,
        newUser: { username: socket.username },
      });
    }
    socket.join(activeRoom);
  }

  socket.on('change room', (room: string) => {
    socket.leave(activeRoom);
    activeRoom = room;
    socket.join(activeRoom);
    io.to(socket.id).emit('change room', activeRoom);
    io.to(socket.id).emit('room join msgs', chatLog[activeRoom]);
  });

  socket.on('retrieve chat', ({ to }: { to: string }) => {
    io.to(to).emit('retrieve chat', chatLog[to]);
  });

  socket.on('newMsg', (msgObj: Message) => {
    if (!chatLog[msgObj.to]) {
      chatLog[msgObj.to] = [msgObj.content];
    } else {
      chatLog[msgObj.to].push(msgObj.content);
    }
    //send back the chat log for the room in the format of an array of type Chat
    io.to(msgObj.to).emit('newMsg', chatLog[msgObj.to]);
  });

  socket.on('typing', (msg: IsTyping) => {
    switch (msg.status) {
      case true:
      // return socket.broadcast.emit('typing', msg);
      default:
      // return socket.broadcast.emit('typing', msg);
    }
  });
});

httpServer.listen(process.env.PORT, () => {
  console.log(`server running on ${process.env.PORT}`);
});
