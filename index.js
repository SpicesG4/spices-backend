const express = require('express')
require('./DB/mangoose')
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
const v1Routes = require('./routes/v1.js');
const v2Routes = require('./routes/v2.js');
const public = require('./routes/public.js');
const messages = require('./routes/messages')
const conversations = require('./routes/conversations');
const admin=require('./routes/admin-route');
const forgetPass=require('./routes/forgitPassword');

//Example
app.use('/', v1Routes);

app.use('/', v2Routes);
app.use('/', public)

app.use('/', messages);
app.use('/', conversations);
app.use('/',admin);
app.use('/',forgetPass);



let users = [];

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

    console.log('client connected', socket.id);
    socket.onAny((event, ...args) => {
        console.log(event, args);
    });

    socket.on('adduser', (payload) => {
        console.log(payload, "soccccckkkeeeetttt");

        //user ID ,, Socket ID
        addUser(payload._id, socket.id);
        console.log(users,"ussssers");

        //all other online users
        io.emit("getUsers", users);
    })


    // socket.on('sendmassege', async (msgcontent) => {
   
          
            
    //             });



                socket.on('joinroon', (payload) => {

                    console.log("aeffd",payload)
                        socket.join(payload.room);
 let data=0;
                        users.map((user) => {
                            if (user.userId == payload.receiverId) {
                                data = user.socketId
                            }
                
                            return
                        })
                        console.log("hhhhh",payload.room)
                        console.log("hhhhhyyy",data)

                    socket.to(data).emit("plzjoin", payload.room);
    
                    console.log("sfg", payload.room)

    
    //almostjoined
    socket.on('almostjoined', (room2) => {
        socket.join(room2);


        console.log(room2,"is it working")
        socket.broadcast.to(room2).emit("getMessages",{test:"datasds"});
    
    })
    
    

    
    
    
    
            // socket.emit("getMessages", { "text": payload.text, "senderId": payload.senderId });
    
    
          

    

    })



    socket.emit('offlineUser', { id: socket.id });
    removeUser(socket.id);

    socket.on('disconnect', () => {
        console.log(socket.id, 'disconnected');
        socket.emit('offlineUser', { id: socket.id });
        removeUser(socket.id);

    });
})


server.listen(port, () => {
    console.log('server is on port ' + port);
})
