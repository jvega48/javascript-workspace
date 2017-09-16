
var origBoard;
const humPlayer = 'O';
const aiPlayer = 'X';
const winnerComb = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [6, 4, 2]
];
const cells = document.querySelectorAll('.cell');
startGame();

function startGame(){
    document.querySelector(".endgame").style.display = "none";
    origBoard = Array.from(Array(9).keys());
    //console.log(origBoard);
    for(var i = 0 ; i < cells.length; i++){
       cells[i].innerText = '';
       cells[i].style.removeProperty('background-color');
       cells[i].addEventListener('click', turnClicks, false);
    }
}

function turnClicks(square){
    //console.log(square.target.id);
    if (typeof origBoard[square.target.id] == 'number'){
        turn(square.target.id, humPlayer)
        if(!checkWinner(origBoard, humPlayer) && !checkTie()) turn(bestPosition(), aiPlayer);
    }
}

function turn(squareId, player){
    origBoard[squareId] = player;
    document.getElementById(squareId).innerText = player;
    let gameWon = checkWinner(origBoard, player);
    if(gameWon) gameOver(gameWon)
}
//functions that check for the winner
function checkWinner(board, player){
    let plays = board.reduce((a, e, i) => 
    (e === player) ? a.concat(i) : a, []);
    let gameWon = null;
    for (let [index, win] of winnerComb.entries()){
        if (win.every(element => plays.indexOf(element) > -1)){
            gameWon = {index: index, player: player};
            break;
        }
    }
    return gameWon;
}

function gameOver(gameWon){
    for (let index of winnerComb[gameWon.index]){
        document.getElementById(index).style.backgroundColor = 
            gameWon.player == humPlayer ? "blue" : "red";
    }

    for(var i = 0 ; i < cells.length; i++){
        cells[i].removeEventListener('click', turnClicks, false);
    }
    declareWinner(gameWon.player == humPlayer ? "You win!" : "You Lost!");
}

function declareWinner(what){
    document.querySelector(".endgame").style.display = "block";
    document.querySelector(".endgame .text").innerText = what;
}

function emptySquares(){
    return origBoard.filter(s => typeof s == 'number');
}

function bestPosition(){
    //return emptySquares()[0];
    return minimax(origBoard, aiPlayer).index;
}

function checkTie(){
    if(emptySquares().length == 0) {
        for(var i = 0 ; i < cells.length; i++){
            cells[i].style.backgroundColor = "orange";
            cells[i].removeEventListener('click', turnClicks, false);
        }
        declareWinner("Tie game!")
        return true;    
    }
    return false;
}

//using the minimax algorithm
function minimax(newBoard, player){
    var openSpots = emptySquares(newBoard);

    if (checkWinner(newBoard, humPlayer)){
        return {score: -10};
    }else if(checkWinner(newBoard, aiPlayer)){
        return {score: 10};
    }else if(openSpots.length === 0){
        return {score: 0};
    }

    var moves = [];
    for(var i = 0 ; i < openSpots.length; i++){
        var move = {};
        move.index = newBoard[openSpots[i]];
        newBoard[openSpots[i]] = player;

        if (player == aiPlayer) {
            var result = minimax(newBoard, humPlayer);
            move.score = result.score;
        }else {
            var result = minimax(newBoard, aiPlayer);
            move.score = result.score;
        }

        newBoard[openSpots[i]] = move.index;
        moves.push(move);        

    }
    var bestMove;
    if(player === aiPlayer){
        var bestScore = -10000;
        for (var i = 0; i < moves.length; i++) {
                 if (moves[i].score > bestScore) {
                     bestScore = moves[i].score;
                     bestMove = i;
                 }
        }
    }else{
        var bestScore = 10000;
        for (var i = 0; i < moves.length; i++) {
                 if (moves[i].score < bestScore) {
                     bestScore = moves[i].score;
                     bestMove = i;
                 }
        }
    }
    return moves[bestMove];
}