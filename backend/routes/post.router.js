const express = require('express');

const isLoggedIn = require('../middleware/isLoggedIn');
const uploadPost = require('../controllers/post.controllers/post.uploadPost');
const upload = require('../config/multer.config');

const router = express.Router();

router.get('/', (req,res) => {
    res.send("Posts Router Working");
});

router.post('/upload', isLoggedIn, upload.single("postpic"), uploadPost);

module.exports = router;