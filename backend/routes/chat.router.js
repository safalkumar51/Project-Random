const express = require('express');

const isLoggedIn = require('../middleware/isLoggedIn');
const chatGetter = require('../controllers/chat.controllers/chat.getter');
const chatSender = require('../controllers/chat.controllers/chat.sender');

const router = express.Router();

router.get('/', isLoggedIn, chatGetter);
router.post('/send', isLoggedIn, chatSender);

module.exports = router;