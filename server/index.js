const io = require('socket.io')(3001, {
    cors: {
        origin: ['http://localhost:3000'],
    },
});

function doesRoomExist(otherPlayerId) {
    return io.sockets.adapter.rooms.has(otherPlayerId)
}

let connections = {};

io.on('connection', socket => {
    connections[socket.id] = null;

    socket.on('check-can-join', (hostId, playerId, cb) => {
        if (connections[hostId] === undefined) {
            cb(1);
            return;
        }
        if (connections[hostId] !== null && connections[hostId] !== playerId) {
            cb(2);
            return;
        }
        cb(0);
    });

    socket.on('play-again', (otherPlayerId) => {
        socket.to(otherPlayerId).emit('tell-play-again');
    });

    socket.on('player-win', (otherPlayerId) => {
        socket.to(otherPlayerId).emit('lose');
    });

    socket.on('room-joined', (hostId, playerId) => {
        connections[hostId] = playerId;
        connections[playerId] = hostId;
        socket.to(hostId).emit('other-player-joined', playerId);
    });

    socket.on('send-data', (mines, rows, cols, otherPlayerId) => {
        socket.to(otherPlayerId).emit('set-data', mines, rows, cols);
    });

    socket.on('update-board', (otherPlayerId, cellInfo) => {
        socket.to(otherPlayerId).emit('send-cell', cellInfo);
    });

    socket.on('disconnect', () => {
        socket.to(connections[socket.id]).emit('room-closed');
        delete connections[connections[socket.id]];
        delete connections[socket.id];
    });
});
