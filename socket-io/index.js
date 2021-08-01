const express = require('express');
const app = express();
const http = require('http');
const PORT = process.env.PORT || 5000;
const cors = require('cors');
const server = http.createServer(app);
const io = require('socket.io')(http);

io.listen(server);

app.use(cors());
io.on('connection', (socket) => {
 console.log('con')
 socket.on('join', (payload) => {
  console.log('work',payload)
  socket.emit('test', { name:"test"});
});
// socket.on('disconnect', () => {
//   socket.to(staffRoom).emit('offlineStaff', { id: socket.id });
// });
});
server.listen(PORT, () => {
  console.log(`Listening on PORT ${PORT}`);
});




















































// const express = require('express');
// const app = express();
// const http = require('http');
// const PORT = process.env.PORT || 5000;
// const cors = require('cors');
// const server = http.createServer(app);
// const io = require('socket.io')(http);
// const staffRoom = 'staff';
// const { v4: uuidv4 } = require('uuid');
// io.listen(server);

// app.use(cors());

// io.on('connection', (socket) => {
//   // console.log('clie.nt connected', socket.id);
//   //2a
//   socket.on('join', (payload) => {
//     // socket.join will put the socket in a private room
//     socket.join(staffRoom);
//     socket.to(staffRoom).emit('onlineStaff', { name: payload.name, id: socket.id });
//   });
//   socket.on('createTicket', (payload) => {
//     // 2
//     socket
//       .in(staffRoom)
//       .emit('newTicket', { ...payload, id: uuidv4(), socketId: socket.id });
//   });

//   socket.on('claim', (payload) => {
//     // when a TA claim the ticket we need to notify the student
//     socket.to(payload.studentId).emit('claimed', { name: payload.name });
//   });
//   socket.on('disconnect', () => {
//     socket.to(staffRoom).emit('offlineStaff', { id: socket.id });
//   });
// });






















// const io = require("socket.io")(8900, {
//   cors: {
//     origin: "http://localhost:3000",
//   },
// });

// let users = [];

// const addUser = (userId, socketId) => {
//   !users.some((user) => user.userId === userId) &&
//     users.push({ userId, socketId });
// };

// const removeUser = (socketId) => {
//   users = users.filter((user) => user.socketId !== socketId);
// };

// const getUser = (userId) => {
//   return users.find((user) => user.userId === userId);
// };

// io.on("connection", (socket) => {
//   //when ceonnect
//   console.log("a user connected.");

//   //take userId and socketId from user
//   socket.on("addUser", (userId) => {
//     addUser(userId, socket.id);
//     io.emit("getUsers", users);
//   });

//   //send and get message
//   socket.on("sendMessage", ({ senderId, receiverId, text }) => {
//     const user = getUser(receiverId);
//     io.to(user.socketId).emit("getMessage", {
//       senderId,
//       text,
//     });
//   });

//   //when disconnect
//   socket.on("disconnect", () => {
//     console.log("a user disconnected!");
//     removeUser(socket.id);
//     io.emit("getUsers", users);
//   });
// });