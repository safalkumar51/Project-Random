const jwt = require('jsonwebtoken');
const messagesModel = require('../models/messages.model');

module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log('Client connected:', socket.id);

        socket.on('join', (authToken) => {
            console.log('Join event received');
            try {
                const decoded = jwt.verify(authToken, process.env.JWT_SECRET);
                socket.join(decoded.id);
                console.log('User joined room:', decoded.id);
            } catch (error) {
                console.error('Token verification failed:', error.message);
            }
        });

        socket.on('message_read', async ({authToken, otherId}) => {
            if(!otherId || !authToken) return;
            try {
                const decoded = jwt.verify(authToken, process.env.JWT_SECRET);
                const update = { $set: { newMessages: 0 } };
                await messagesModel.findOneAndUpdate({from: otherId, to: decoded.id}, update);
            } catch (error) {
                console.error('Token verification failed:', error.message);
            }
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected:', socket.id);
        });
    });
};
