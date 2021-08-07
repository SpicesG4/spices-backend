const express = require('express')
require('./SRC/DB/mangoose')
require('dotenv').config()
const cors = require('cors');
const morgan = require('morgan');
const port = process.env.PORT
const app = express()
app.use(cors());

const socketIo = require('socket.io');
const http = require('http');
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: '*',
    },
});

app.use(morgan('dev'));
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

//Routes
const authRoutes = require('./SRC/routes/auth/authRoutes.js');
const chefRoutes = require('./SRC/routes/auth/chef/chefRoutes.js');
const public = require('./SRC/routes/public/public.js');
const messages = require('./SRC/routes/public/messages')
const conversations = require('./SRC/routes/public/conversations');
const admin = require('./SRC/routes/auth/admin/adminRoutes');
const forgetPass = require('./SRC/routes/auth/user/forgotPassword');
const usersRoutes = require('./SRC/routes/auth/user/userauth');

//Calling Routes
app.use('/', authRoutes);
app.use('/', chefRoutes);
app.use('/', public)

app.use('/', messages);
app.use('/', conversations);
app.use('/', admin);
app.use('/', forgetPass);
app.use('/', usersRoutes);


let users = [];
const queue = [];
const addUser = (userId, socketId) => {
    !users.some((user) => user.userId === userId) &&
        users.push({ userId, socketId });
};
const removeUser = (socketId) => {
    users = users.filter((user) => user.socketId !== socketId);
};
const getUser = (userId) => {
    return users.find((user) => user.userId === userId);
};
io.on('connection', (socket) => {

    socket.on('adduser', (payload) => {
        console.log('User Added');
        addUser(payload._id, socket.id);
        io.emit("getUsers", users);
    })

    let reciverSocket = 0;
    socket.on('reciveID', (id) => {
        reciverSocket = getUser(id)
    });

    socket.on('sendmassege', (payload) => {

        queue.push({ "text": payload.text, "senderId": payload.senderId });
        socket.to(reciverSocket.socketId).emit("getoneMessage", payload)
        socket.to(reciverSocket.socketId).emit("getallmessages", queue)
    });
    socket.on('disconnect', () => {
        socket.emit('offlineUser', { id: socket.id });
        removeUser(socket.id);
    });
})

server.listen(port, () => {
    console.log('server is on port ' + port);
})
