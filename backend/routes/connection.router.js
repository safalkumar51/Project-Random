const express = require('express');

const isLoggedIn = require('../middleware/isLoggedIn');
const connectionAccept = require('../controllers/connection.controllers/connection.accept');
const connectionReject = require('../controllers/connection.controllers/connection.reject');
const connectionRemove = require('../controllers/connection.controllers/connection.remove');

const router = express.Router();

router.post('/', isLoggedIn, async (req, res) => {
    res.send("Friend Request Router Working");
});

router.post('/accept', isLoggedIn, connectionAccept);
router.post('/reject', isLoggedIn, connectionReject);
router.post('/remove', isLoggedIn, connectionRemove);

module.exports = router;