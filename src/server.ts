import Socket from 'socket.io';
import Player from './Models/Player';

const io = Socket();
io.listen(process.env.PORT || 52300);

console.log(`Server has started`);

let players = new Map();
let sockets = new Map();

io.on('connection', (socket) => {

    let player = new Player();
    let socketPlayerId = player.id;

    players.set(socketPlayerId, player);
    sockets.set(socketPlayerId, socket);

    socket.emit('register', { id: socketPlayerId });
    socket.emit('spawn', player);
    socket.broadcast.emit('spawn', player);

    console.log(`Player [${socketPlayerId}] has connected!`);

    for (var playerId in players) {
        if (playerId != socketPlayerId) {
            socket.emit('spawn', players.get(playerId));
        }
    }

    socket.on("updatePosition", function (data) {
        player.position.x = data.position.x;
        player.position.y = data.position.y;

        socket.broadcast.emit('updatePosition', player);
    });

    socket.on('disconnect', function () {
        console.log(`Player [${socketPlayerId}] has disconnected`);
        players.delete(socketPlayerId);
        sockets.delete(socketPlayerId);
        socket.broadcast.emit('disconnected', player);
    });
});
