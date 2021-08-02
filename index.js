const express = require('express')
require('./DB/mangoose')
require('dotenv').config()
const cors = require('cors');
const morgan = require('morgan');
const port = process.env.PORT
const app = express()
//Socket stuff
const socketIo = require('socket.io');
const http = require('http');
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
      origin: '*',
    },
  });



app.use(cors());
app.use(morgan('dev'));

app.use(express.json())
app.use(express.urlencoded({ extended: true }));




//Routes
const v1Routes = require('./routes/v1.js');
const v2Routes = require('./routes/v2.js');
const public = require('./routes/public.js');
const messages = require('./routes/messages')
const conversations = require('./routes/conversations');

//Example
app.use('/', v1Routes);

app.use('/', v2Routes);
app.use('/', public)

app.use('/', messages);
app.use('/', conversations);




//Starting in socket

let users = [];

const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};




io.on('connection', (socket) => {
    console.log('con')
    socket.on('join', (payload) => {


        console.log(socket.id,"soccket")
        console.log(payload.id,"iddddd")
 
     addUser(payload.id, socket.id);

     console.log('work',payload)
   });
   socket.emit('test', { name:"sdadfafdfeadfc"});

   // socket.on('disconnect', () => {
   //   socket.to(staffRoom).emit('offlineStaff', { id: socket.id });
   // });



//    io.on("addUser", (userId) => {

//     // io.emit("getUsers", users);
//   });


   });



server.listen(port || 3001, () => {
    console.log('listening on *: '+port);
  });

// server.listen( () => {
//     console.log('socket is on port ' + 3007);
// })