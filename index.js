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

//Example
app.use('/', v1Routes);

app.use('/', v2Routes);
app.use('/', public)

app.use('/', messages);
app.use('/', conversations);



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

    console.log('client connected', socket.id);
    // socket.onAny((event, ...args) => {
    //     console.log(event, args);
    // });

    socket.on('adduser', (payload) => {
        console.log(payload, "soccccckkkeeeetttt");
        addUser(payload._id, socket.id);
        console.log(users);
        io.emit("getUsers", users);
    })


    socket.on('sendmassege', (payload) => {
        console.log(payload, "mmmmm");

        console.log(users, "useeeers only");

        let data = 0;
        users.map((user) => {
            if (user.userId == payload.receiverId) {
                data = user.socketId
            }

            return
        })
        let rdata = 0

        users.map((user) => {
            if (user.userId == payload.senderId) {
                rdata = user.socketId
            }

            return
        })

        console.log("daaata", data)
        // socket.emit("getMessage", {"text" :payload.text});
        async () => {

            const sendemmm = {
                conversationId: payload.conversationId,
                sender: payload.senderId,
                text: payload.text

            }


            const savedmessage = await axios.post('http://localhost:3001/messages', sendemmm)



            console.log("saved Msg", savedmessage.data)
            socket.to(data).emit("getoneMessage", {
                "text": payload.text, "senderId": payload.senderId


            });
            socket.to(rdata).emit("getoneMessagerecev", {
                "text": payload.text, "senderId": payload.receiverId

            });
            console.log("hihiuhihoh", payload.receiverId, payload.text)
        }

        queue.push({ "text": payload.text, "senderId": payload.senderId });
        console.log([...queue]);
        socket.emit("getallmessages", [...queue]



        )


    })
    socket.on('disconnect', () => {
        console.log(socket.id, 'disconnected');
        socket.emit('offlineUser', { id: socket.id });
        removeUser(socket.id);

    });

})


server.listen(port, () => {
    console.log('server is on port ' + port);
})
