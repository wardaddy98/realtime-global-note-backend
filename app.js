import cors from 'cors';
import express from 'express';
import http from 'http';
import mongoose from 'mongoose';
import { Server } from 'socket.io';
import { DB_URI, PORT } from './constants.js';
import mainRouter from './routes.js';
import { subscribeUser, unSubscribeUser } from './src/utils/socketUtils.js';

try {
  mongoose.connect(DB_URI).then(() => {
    console.log('Database connection established');
  });
} catch (err) {
  console.log(err);
}

const app = express();
const server = http.createServer(app);

//initializing socket instance
const io = new Server(server);
// making socket globally accessible by setting it to global object in node environment
global.socketIo = io;

io.on('connection', socket => {
  console.log(`Socket connection established with id ${socket.id}`);

  socket.on('disconnect', () => {
    console.log(`Socket connection destroyed with id ${socket.id}`);
  });

  socket.on('subscribe', subscribeUser);
  socket.on('unsubscribe', unSubscribeUser);

  //for editing status of notes
  socket.on('note-in-use', noteId => {
    socket.broadcast.emit('note-in-use', noteId);
  });
  socket.on('note-not-in-use', noteId => {
    socket.broadcast.emit('note-not-in-use', noteId);
  });
});

app.use(express.json());

app.use(
  cors({
    origin: '*',
    methods: ['GET', 'PATCH', 'POST', 'DELETE'],
  }),
);

app.use('/', mainRouter);

server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
  console.log('test');
});
