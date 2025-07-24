const express = require('express');

const isLoggedIn = require('../middleware/isLoggedIn');
const uploadPost = require('../controllers/post.controllers/post.uploadPost');
const upload = require('../config/multer.config');
const { getUserProfileByPost } = require('../controllers/post.controllers/post.toprofile');
const { getPostWithComments } = require('../controllers/post.controllers/post.PostWithComments');
const { likeUnlikePost } = require('../controllers/post.controllers/post.likeUnlike');
const { addComment, deleteComment } = require('../controllers/post.controllers/post.comment');

const router = express.Router();

router.get('/', (req,res) => {
    res.send("Post Router Working");
});

router.post('/upload', isLoggedIn, upload.single("postpic"), uploadPost);

router.get('/profile', isLoggedIn, getUserProfileByPost);

router.post('/details', isLoggedIn, getPostWithComments);

// Like or Unlike a post
router.post('/like', isLoggedIn, likeUnlikePost);

// Add a comment to a post
router.post('/comment', isLoggedIn, addComment);

// Delete a comment by ID
router.delete('/comment/:commentId', isLoggedIn, deleteComment);

module.exports = router;
