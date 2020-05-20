export default function renderScreen(screen, game, requestAnimationFrame, currentPlayerId) {
    const context = screen.getContext('2d');
    context.fillStyle = 'white';
    context.clearRect(0, 0, 40, 40);
    for (const playerId in game.state.players) { // o playerId so captura o label
        const player = game.state.players[playerId];
        context.fillStyle = '#F00';
        context.fillRect(player.x, player.y, 1, 1);
    }

    for (const fruitId in game.state.fruits) {// aqui tbm o fruitId so pega o label
        const fruit = game.state.fruits[fruitId];
        context.fillStyle = '#99FF11';
        context.fillRect(fruit.x, fruit.y, 1, 1);
    }

    const currentPlayer = game.state.players[currentPlayerId];

    if (currentPlayer) {
        context.fillStyle = 'white';
        context.fillRect(currentPlayer.x, currentPlayer.y, 1, 1);
    }

    window.requestAnimationFrame(() => {
        renderScreen(screen, game, requestAnimationFrame, currentPlayerId)
    });
}