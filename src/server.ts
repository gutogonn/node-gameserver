import NetworkObject from './Models/NetworkObject';
import Socket from 'socket.io';

const io = Socket();
io.listen(process.env.PORT || 52300);

console.log(`Server has started`);

let players: Record<string, object> = {};
let sockets: Record<string, object> = {};

io.on('connection', (socket) => {

    let networkObject = new NetworkObject();
    let socketPlayerId = networkObject.id;

    players[socketPlayerId] = networkObject;
    sockets[socketPlayerId] = socket;

    socket.emit('register', { id: socketPlayerId });
    socket.emit('spawn', networkObject);
    socket.broadcast.emit('spawn', networkObject);

    console.log(`Player [${socketPlayerId}] has connected!`);

    for (var playerId in players) {
        if (playerId != socketPlayerId) {
            socket.emit('spawn', players[playerId]);
        }
    }

    socket.on("updatePosition", (data) => {
        networkObject.position.x = data.position.x;
        networkObject.position.y = data.position.y;

        socket.broadcast.emit('updatePosition', networkObject);
    });

    socket.on('disconnect', () => {
        console.log(`Player [${socketPlayerId}] has disconnected`);
        delete players[socketPlayerId];
        delete sockets[socketPlayerId];
        socket.broadcast.emit('disconnected', networkObject);
    });
});