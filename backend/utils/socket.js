const jwt = require('jsonwebtoken');

module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log('Client connected:', socket.id);

        socket.on('join', (authToken) => {
            console.log(authToken);
            console.log('Join event received');
            try {
                const decoded = jwt.verify(authToken, process.env.JWT_SECRET);
                socket.join(decoded.id);
                console.log('User joined room:', decoded.id);
            } catch (error) {
                console.error('Token verification failed:', error.message);
            }
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected:', socket.id);
        });
    });
};
