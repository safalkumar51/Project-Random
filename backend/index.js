require('dotenv').config();

const express = require('express');

const http = require('http');
const cors = require('cors')
const path = require('path');
const { Server } = require('socket.io');

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // Change this to your frontend URL in production
    methods: ['GET', 'POST']
  }
});

const PORT = process.env.PORT || 3000;
app.use(cors());

const DB = require('./config/mongoDB.config');

require('./utils/socket')(io); // pass io instance to socket logic
app.set('io', io);       // make io accessible in routes

const userRouter = require('./routes/user.router');
const postRouter = require('./routes/post.router');
const adminRouter = require('./routes/admin.router');
const locationRouter = require('./routes/location.router');
const connectiontRouter = require('./routes/connection.router');
const chatRouter = require('./routes/chat.router');
const messagesRouter = require('./routes/messages.router');

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/',async (req,res) => {
  res.send("Base Url Working");
})

app.use('/user', userRouter);
app.use('/admin', adminRouter);
app.use('/post', postRouter);
app.use('/location', locationRouter);
app.use('/connection', connectiontRouter);
app.use('/chat', chatRouter);
app.use('/messages', messagesRouter);

server.listen(PORT, () => {
  console.log(`Server running on localhost:${PORT}`);
});



