var board;
const HUMAN_AGENT = 'O';
const AI_AGENT = 'X';
const WINCOMBOS = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,4,8],
    [2,4,6],
    [1,4,7],
    [0,3,6],
    [2,5,8]
]

const cells = document.querySelectorAll('.cell');
startGame();
function startGame() {
    document.querySelector(".endgame").style.display="none";
    board = Array.from(Array(9).keys());
    // remove content of each cell if present
    for(var i of cells){
        i.innerText = '';
        i.style.removeProperty('background-color');
        i.addEventListener('click',turnClick,false);
    }
}

function turnClick(square){
    if(typeof board[square.target.id]=='number'){
        turn(square.target.id,HUMAN_AGENT)
        setTimeout(()=>{
            if(!checkTie()){
                turn(bestSpot(),AI_AGENT);
            }
        },500)
    }
}

function turn(square_id,player){
    board[square_id] = player;
    document.getElementById(square_id).innerText = player;
    let isEnd = checkWin(board,player);
    if (isEnd) gameOver(isEnd);
}

function checkWin(crt_board,player){
    let plays = crt_board.reduce((a,e,i)=>
        (e===player)? a.concat(i): a,[]);
    let gameWon = null;
    for (let [idx,win] of WINCOMBOS.entries()){
        if(win.every(elem=>plays.indexOf(elem)>-1)){
            gameWon  = {index:idx,player:player};
            break;
        }
    }
    return gameWon;
}

function gameOver(gameWon){
    for(let idx of WINCOMBOS[gameWon.index]){
        // if the human player has won
        document.getElementById(idx).style.backgroundColor = 
            gameWon.player===HUMAN_AGENT? 'blue': 'red';

        for(let cell of cells){
            cell.removeEventListener('click',turnClick,false)
        }
    }
    declareWinner(gameWon.player==HUMAN_AGENT? "You Win!":"You Lose!");
}

function bestSpot(){
    return minimax(board,AI_AGENT).index;
}

function emptySquares(){
    return board.filter(s=>typeof s == 'number');
}

function checkTie(){
    if(emptySquares().length==0){
        for( let cell of cells){
            cell.style.backgroundColor = 'green';
            cell.removeEventListener('click',turnClick,false);
        }
        declareWinner("Tie!!");
        return true;
    }
    return false;
}

function declareWinner(text){
    document.querySelector('.endgame').style.display = 'block'
    document.querySelector('#msg').innerText = text;
}

function minimax(newBoard,player,alpha=-10000,beta=10000){
    var availSpots = emptySquares();

    if (checkWin(newBoard, HUMAN_AGENT)) {
        return { score: -10 };
    } else if (checkWin(newBoard, AI_AGENT)) {
        return { score: 10 };
    } else if (availSpots.length === 0) {
        return { score: 0 };
    }
    var moves = [];
    for (var spot of availSpots) {
        var move = {};
        move.index = newBoard[spot];
        newBoard[spot] = player;

        if (player == AI_AGENT) {
            var result = minimax(newBoard, HUMAN_AGENT,alpha,beta);
            if(result.score>alpha){
                alpha = result.score;
            }
            move.score = result.score;
        } else {
            var result = minimax(newBoard, AI_AGENT,alpha,beta);
            move.score = result.score;
            if(result.score<beta) beta = result.score
        }
        newBoard[spot] = move.index;
        moves.push(move);
        if (beta < alpha) break;
    }

    var bestMove;
    if (player === AI_AGENT) {
        var bestScore = -10000;
        for (var move of moves) {
            if (move.score > bestScore) {
                bestScore = move.score;
                bestMove = move;
            }
        }
    } else {
        var bestScore = 10000;
        for (var move of moves) {
            if (move.score < bestScore) {
                bestScore = move.score;
                bestMove = move;
            }
        }
    }
    return bestMove;
}