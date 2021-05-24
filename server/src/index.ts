import express from 'express';
import http from 'http';
import 'dotenv/config';
import router from './routes/homepage';
import morgan from 'morgan';
import cors from 'cors';

const app = express();
app.use(cors());
const httpServer = http.createServer(app);

const io = require('socket.io')(httpServer, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

app.use(express.json());
app.use(morgan('tiny'));
app.use('/', router);

io.on('connection', (socket: any) => {
  console.log('connection established');
  socket.on('increment', () => {
    console.log('recieved this request');
    io.emit('inc');
  });
});

httpServer.listen(process.env.PORT, () => {
  console.log(`server running on ${process.env.PORT}`);
});
