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

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

// const upload = require('./config/multer-config');

app.use(cookieParser());
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/',async (req,res) => {
  res.send("Working");
})

app.use('/user', userRouter);
app.use('/admin', adminRouter);
app.use('/post', postRouter);

app.listen(PORT, () => {
  console.log(`Server running on localhost:${PORT}`);
});



