require('dotenv').config();

const express = require('express');
const app = express();

const cors = require('cors')
const path = require('path');
const DB = require('./config/mongoDB.config');

const PORT = process.env.PORT || 3000;
const userRouter = require('./routes/user.router');
const postRouter = require('./routes/post.router');
const adminRouter = require('./routes/admin.router');
const locationRouter = require('./routes/location.router');
const connectiontRouter = require('./routes/connection.router')

app.use(cors());

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

app.listen(PORT, () => {
  console.log(`Server running on localhost:${PORT}`);
});



