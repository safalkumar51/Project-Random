const express = require('express');

const isLoggedIn = require('../middleware/isLoggedIn');
const connectionAccept = require('../controllers/connection.controllers/connection.accept');
const connectionReject = require('../controllers/connection.controllers/connection.reject');
const connectionRemove = require('../controllers/connection.controllers/connection.remove');
const connectionGetter = require('../controllers/connection.controllers/connection.getter');
const connectionRequestsGetter = require('../controllers/connection.controllers/connection.requestsGetter');

const router = express.Router();

router.get('/', isLoggedIn, connectionGetter);
router.post('/accept', isLoggedIn, connectionAccept);
router.post('/reject', isLoggedIn, connectionReject);
router.post('/remove', isLoggedIn, connectionRemove);
router.get('/requests', isLoggedIn, connectionRequestsGetter);

module.exports = router;