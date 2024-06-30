const socketIo = require('socket.io');

module.exports.chatSockets = function(socketServer) {
    const io = socketIo(socketServer, {
        cors: {
            origin: 'http://localhost:5503',
            methods: ['GET', 'POST'],
            credentials: true
        }
    });

    io.on('connection', (socket) => {
        console.log('New connection received', socket.id);

        socket.on('join_room', (data) => {
            console.log('Joining request received', data);
            socket.join(data.chatroom);
            io.in(data.chatroom).emit('user_joined', data);
        });

        socket.on('send_message', (data) => {
            io.in(data.chatroom).emit('receive_message', data);
        });

        socket.on('disconnect', () => {
            console.log('Socket disconnected');
        });
    });
};
