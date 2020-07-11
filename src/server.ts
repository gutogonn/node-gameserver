import Player from './Models/Player';
import Socket from 'socket.io';

const io = Socket();
io.listen(process.env.PORT || 52300);

console.log(`Server has started`);

// let players: Record<string, object> = {};
// let sockets: Record<string, object> = {};

let players: Record<string, object> = {};
let sockets: Record<string, object> = {};

io.on('connection', (socket) => {

    let player = new Player();
    let socketPlayerId = player.id;

    players[socketPlayerId] = player;
    sockets[socketPlayerId] = socket;

    socket.emit('register', { id: socketPlayerId });
    socket.emit('spawn', player);
    socket.broadcast.emit('spawn', player);

    console.log(`Player [${socketPlayerId}] has connected!`);

    for (var playerId in players) {
        if (playerId != socketPlayerId) {
            socket.emit('spawn', players[playerId]);
        }
    }

    socket.on("updatePosition", (data) => {
        player.position.x = data.position.x;
        player.position.y = data.position.y;

        socket.broadcast.emit('updatePosition', player);
    });

    socket.on('disconnect', () => {
        console.log(`Player [${socketPlayerId}] has disconnected`);
        delete players[socketPlayerId];
        delete sockets[socketPlayerId];
        socket.broadcast.emit('disconnected', player);
    });
});
