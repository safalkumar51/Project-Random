require('dotenv').config();

const express = require('express');
const app = express();

const path = require('path');
const DB = require('./config/mongoDB-config');

const PORT = process.env.PORT || 3000;

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

// const upload = require('./config/multer-config');

app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/',async (req,res) => {
  res.send("Working");
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});



