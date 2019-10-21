const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);
const port = 3000;

io.on('connection', socket => {
  console.warn('a user connected ;D');
  socket.on('chat message', msg => {
    console.warn(msg);
    io.emit('chat message', msg);
  });
});

server.listen(port, () => console.warn('server running on port: ' + port));
