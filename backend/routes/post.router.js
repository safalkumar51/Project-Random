const express = require('express');

const isLoggedIn = require('../middleware/isLoggedIn');
const uploadPost = require('../controllers/post.controllers/post.uploadPost');
const upload = require('../config/multer.config');
const likeUnlikePost = require('../controllers/post.controllers/post.likeUnlike');
const { addComment, deleteComment } = require('../controllers/post.controllers/post.comment');
const getPostWithComments = require('../controllers/post.controllers/post.PostWithComments');
const likeUnlikeComment = require('../controllers/post.controllers/post.commentLikeUnlike');

const router = express.Router();

router.get('/', isLoggedIn, getPostWithComments);

router.post('/upload', isLoggedIn, upload.single("postpic"), uploadPost);

// Like or Unlike a post
router.post('/like', isLoggedIn, likeUnlikePost);

// Add a comment to a post
router.post('/comment', isLoggedIn, addComment);

router.post('/comment/like', isLoggedIn, likeUnlikeComment);

// Delete a comment by ID
router.delete('/comment/:commentId', isLoggedIn, deleteComment);

module.exports = router;
