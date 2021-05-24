import express from 'express';
import http from 'http';
import 'dotenv/config';
import router from './routes/homepage';
import morgan from 'morgan';
import socketio from 'socket.io';

const app = express();
const server = http.createServer(app);
const io = new socketio.Server(server);

app.use(express.json());
app.use(morgan('tiny'));
app.use('/', router);

io.on('connection', (socket) => {
  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });
});

server.listen(process.env.PORT, () => {
  console.log(`server running on ${process.env.PORT}`);
});
