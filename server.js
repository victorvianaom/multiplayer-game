import express from 'express';
import http from 'http';
import createGame from './public/game.js'; //acoplando o front com o back por meio do game.js, mas isso is perigoso!!!
import socketio from 'socket.io';

const app = express();//instancia do express
const server = http.createServer(app); //e esse servidor padrao do node esta infectado com uma instancia do express
const sockets = socketio(server);   //o servidor sockets esta infectado com esse servidor padrao do node
//os items acima estao muito connectados...

app.use(express.static('public'));

const game = createGame();
game.start();

game.subscribe((command) => {
    console.log(`> Emitting ${command.type}`);
    sockets.emit(command.type, command);
});

sockets.on('connection', (socket) => {//no server side tbm se utiliza um Event Emitter, nesse caso
                                      // se chama 'sockets', como o servidor vai centralizar varios sockets,
                                      // isso aqui e uma lista de sockets.
                                      // quando o cliente se conecta ele injeta esse objeto de 'socket' pra dentro 
                                      // dessa funcao... o objecto singular 'socket' tambem e um Event Emitter 
    const playerId = socket.id;
    console.log(`> Player connected: ${playerId}`);

    game.addPlayer({ playerId: playerId });

    socket.emit('setup', game.state);//estou emitindo para o socket que se conectou como cliente
                                     //um evento que escolhi chamar de 'setup', e como objeto
                                     // estou enviando game.state
    socket.on('disconnect', () => {
        game.removePlayer({ playerId: playerId });
        console.log(`> Player disconnected: ${playerId}`);
    });

    socket.on('move-player', (command) => {
        command.playerId = playerId;
        command.type = 'move-player';

        game.movePlayer(command);
    });
});

server.listen(3000, () => {
    console.log(`> Server listening on Port: 3000`)
});