const deck  = require('./deck');
const board = require('./board');
const cardPositions = require('./cardPositions');

class Consecutive {
    constructor(board, deck, teams) {
        this.board = board;
        this.deck = deck;
        this.teams = teams;
    }

    twoEyedJacks = {
        'jd': 0,
        'jc': 1
    }
    oneEyedJacks = {
        'js': 0,
        'jh': 1
    }

    getPlayerHandSize(numPlayers) {
        let size = 0
        switch(numPlayers) {
            case '2':
                size = 7;
                break;
            case '3':
                size = 6;
                break;
            case '4':
                size = 6;
                break;
            case '6':
                size = 5;
                break;
            case '8':
                size = 4;
                break;
            case '9':
                size = 4;
                break;
            case '10':
                size = 3;
                break;
            case '12':
                size = 3;
                break;
        }
        return size;
    }

    shuffleDeck() {
        for (let i = this.deck.length - 1; i > 0; i--) {
            let r = Math.floor(Math.random() * (i + 1));
            let temp = this.deck[r];
            this.deck[r] = this.deck[i];
            this.deck[i] = temp;
        }
    }

    isDeckEmpty() {
        if (this.deck.length === 0) {
            return true
        }
        return false
    }

    getCardStack(amount) {
        let stack = []
        for (let i = 0; i < amount; i++) {
            stack.push({ card: this.deck.pop(), isDead: false });
            if (this.isDeckEmpty()) {
                break;
            }
        }
        return stack;
    }

    getCard() {
        if (this.isDeckEmpty()) {
            return null;
        }
        const newCard = this.deck.pop();
        return { card: newCard, isDead: this.isDeadCard(newCard) };
    }

    removeCard(card, team, row, col) {
        if (row < this.board.length && col < this.board[0].length) {
            const place = this.board[row][col];
            if (card in this.oneEyedJacks && place.occupied && !place.isSequence && place.team !== team) {
                this.board[row][col].occupied = false;
                this.board[row][col].team = null;
                return true
            }
        }
        return false;
    }

    placeCard(card, team, row, col) {
        if (row < this.board.length && col < this.board[0].length) {
            const place = this.board[row][col];
            if ((place.card === card || card in this.twoEyedJacks) && !place.occupied) {
                this.board[row][col].occupied = true;
                this.board[row][col].team = team;
                return true;
            }
        }
        return false;
    }

    isDeadCard(card) {
        if (card in this.twoEyedJacks || card in this.oneEyedJacks) return false;
        const positionOne = cardPositions[card][0];
        const positionTwo = cardPositions[card][1];
        if (this.board[positionOne[0]][positionOne[1]].occupied && this.board[positionTwo[0]][positionTwo[1]].occupied) {
            return true;
        }
        return false;
    }

    async updateSequences(row, col, team) {
        if (!this.board[row][col].occupied) {
            return []
        }
        let newSequences = [];
        // check vertically
        if ((row - 1 >= 0 && (this.board[row-1][col].team === team || this.board[row-1][col].card === 'w'))
        || (row + 1 <= this.board.length-1 && (this.board[row+1][col].team === team || this.board[row+1][col].card === 'w'))) {
            let potentialFiveSequence = [];
            let potentialTenSequence = [];
            let prevSpace = this.board[0][col];
            if (prevSpace.team === team || prevSpace.card === 'w') {
                potentialFiveSequence.push([0, col]);
                potentialTenSequence.push([0, col]);
            }
            for (let i = 1; i < this.board.length; i++) {
                if ((this.board[i][col].team === team || this.board[i][col].card === 'w')
                && !(prevSpace.isSequence && this.board[i][col].isSequence)) {
                    potentialFiveSequence.push([i, col]);
                    if (potentialTenSequence.length === i) {
                        potentialTenSequence.push([i, col]);
                    }
                } else if ((this.board[i][col].team === team || this.board[i][col].card === 'w')
                && (potentialTenSequence.length === i)) {
                    potentialTenSequence.push([i, col]);
                    potentialFiveSequence = [];
                } else {
                    potentialFiveSequence = []
                    potentialTenSequence = [];
                }
                prevSpace = this.board[i][col];
                if (potentialTenSequence.length === 10) {
                    newSequences.push(potentialTenSequence.slice(0, 5));
                    newSequences.push(potentialTenSequence.slice(5, 10));
                } else if (potentialFiveSequence.length === 5) {
                    newSequences.push(potentialFiveSequence);
                    potentialFiveSequence = []
                }
            }
        }

        // check horizontally
        if ((col - 1 >= 0 && (this.board[row][col-1].team === team || this.board[row][col-1].card === 'w'))
        || (col + 1 <= this.board[0].length-1 && (this.board[row][col+1].team === team || this.board[row][col+1].card === 'w'))) {
            let potentialFiveSequence = [];
            let potentialTenSequence = [];
            let prevSpace = this.board[row][0];
            if (prevSpace.team === team || prevSpace.card === 'w') {
                potentialFiveSequence.push([row, 0]);
                potentialTenSequence.push([row, 0]);
            }
            for (let i = 1; i < this.board[0].length; i++) {
                if ((this.board[row][i].team === team || this.board[row][i].card === 'w')
                && !(prevSpace.isSequence && this.board[row][i].isSequence)) {
                    potentialFiveSequence.push([row, i]);
                    if (potentialTenSequence.length === i) {
                        potentialTenSequence.push([row, i]);
                    }
                } else if ((this.board[row][i].team === team || this.board[row][i].card === 'w')
                && (potentialTenSequence.length === i)) {
                    potentialTenSequence.push([row, i]);
                    potentialFiveSequence = [];
                } else {
                    potentialFiveSequence = [];
                    potentialTenSequence = [];
                }
                prevSpace = this.board[row][i];
                if (potentialTenSequence.length === 10) {
                    newSequences.push(potentialTenSequence.slice(0, 5));
                    newSequences.push(potentialTenSequence.slice(5, 10));
                } else if (potentialFiveSequence.length === 5) {
                    newSequences.push(potentialFiveSequence);
                    potentialFiveSequence = [];
                }
            }
        }

        // check diagonally topleft-botright
        // if r > c ? r - c : c - r
        if ((col - 1 >= 0 && row - 1 >= 0 && (this.board[row-1][col-1].team === team || this.board[row-1][col-1].card === 'w'))
        || (col + 1 <= this.board[0].length-1 && row + 1 <= this.board[0].length-1
            && (this.board[row+1][col+1].team === team || this.board[row+1][col+1].card === 'w'))) {
            let potentialFiveSequence = [];
            let potentialTenSequence = [];
            const rowStart = row > col ? row - col : 0;
            const colStart = col > row ? col - row : 0;
            let prevSpace = this.board[rowStart][colStart];
            if (prevSpace.team === team || prevSpace.card === 'w') {
                potentialFiveSequence.push([rowStart, colStart]);
                potentialTenSequence.push([rowStart, colStart]);
            }
            for (let i = 1; i < this.board.length - ((rowStart > colStart) ? rowStart : colStart); i++) {
                let c = colStart + i;
                let r = rowStart + i;
                if ((this.board[r][c].team === team || this.board[r][c].card === 'w')
                && !(prevSpace.isSequence && this.board[r][c].isSequence)) {
                    potentialFiveSequence.push([r, c]);
                    if (colStart === 0 && rowStart === 0 && potentialTenSequence.length === i) {
                        potentialTenSequence.push([r, c]);
                    }
                } else if ((this.board[r][c].team === team || this.board[r][c].card === 'w')
                && (potentialTenSequence.length === i)) {
                    potentialTenSequence.push([r, c]);
                    potentialFiveSequence = [];
                } else {
                    potentialFiveSequence = [];
                    potentialTenSequence = [];
                }
                prevSpace = this.board[r][c];
                if (potentialTenSequence.length === 10) {
                    newSequences.push(potentialTenSequence.slice(0, 5));
                    newSequences.push(potentialTenSequence.slice(5, 10));
                } else if (potentialFiveSequence.length === 5) {
                    newSequences.push(potentialFiveSequence);
                    potentialFiveSequence = [];
                }
            }
        }

        // check diagonally botleft-topright
        if ((col - 1 >= 0 && row + 1 <= this.board[0].length-1 && (this.board[row+1][col-1].team === team || this.board[row+1][col-1].card === 'w'))
        || (col + 1 <= this.board[0].length-1 && row - 1 >= 0 && (this.board[row-1][col+1].team === team || this.board[row-1][col+1].card === 'w'))) {
            let potentialFiveSequence = [];
            let potentialTenSequence = [];
            const rcSum = row + col;
            const rowStart = rcSum > this.board.length - 1 ? this.board.length - 1 : rcSum;
            const colStart = rcSum < this.board.length - 1 ? 0 : rcSum - this.board.length + 1;
            let prevSpace = this.board[rowStart][colStart];
            if (prevSpace.team === team || prevSpace.card === 'w') {
                potentialFiveSequence.push([rowStart, colStart]);
                potentialTenSequence.push([rowStart, colStart]);
            }
            for (let i = 1; i < rowStart - colStart + 1; i++) {
                let c = colStart + i;
                let r = rowStart - i;
                if ((this.board[r][c].team === team || this.board[r][c].card === 'w')
                && !(prevSpace.isSequence && this.board[r][c].isSequence)) {
                    potentialFiveSequence.push([r, c]);
                    if (colStart === 0 && rowStart === 9 && potentialTenSequence.length === i) {
                        potentialTenSequence.push([r, c]);
                    }
                } else if ((this.board[r][c].team === team || this.board[r][c].card === 'w')
                && (potentialTenSequence.length === i)) {
                    potentialTenSequence.push([r, c]);
                    potentialFiveSequence = [];
                } else {
                    potentialFiveSequence = [];
                    potentialTenSequence = [];
                }
                prevSpace = this.board[r][c];
                if (potentialTenSequence.length === 10) {
                    newSequences.push(potentialTenSequence.slice(0, 5));
                    newSequences.push(potentialTenSequence.slice(5, 10));
                } else if (potentialFiveSequence.length === 5) {
                    newSequences.push(potentialFiveSequence);
                    potentialFiveSequence = [];
                }
            }
        }

        if (newSequences.length > 0) {
            for (let i = 0; i < newSequences.length; i++) {
                for (let j = 0; j < newSequences[i].length; j++) {
                    this.board[newSequences[i][j][0]][newSequences[i][j][1]].isSequence = true;
                }
            }
            this.teams[team].sequences += newSequences.length;
        }
        return newSequences;
    }

    printBoard() {
        for (let r = 0; r < this.board.length; r++) {
            let row = []
            for (let c = 0; c < this.board[0].length; c++) {
                if (this.board[r][c].occupied) {
                    row.push(this.board[r][c].team.padEnd(5));
                } else {
                    row.push(this.board[r][c].card.padEnd(5));
                }
            }
            console.log(row.toString());
        }
    }
}
// var teams = { 'B': { sequences: 0 }, 'R': { sequences: 0 } }
// var game = new Consecutive(board, deck, teams);
// game.printBoard();
// game.placeCard('ad', 'B', 1, 0);
// game.placeCard('ad', 'B', 6, 2);
// game.printBoard();
// console.log(game.isDeadCard('ad'))
// console.log(deck);
// game.shuffleDeck();
// console.log(deck);
// game.placeCard('ad', 'B', 6, 2);
// game.placeCard('10h', 'B', 5, 3);
// game.placeCard('2h', 'B', 4, 4);
// game.placeCard('6h', 'B', 3, 5);
// game.placeCard('6c', 'B', 2, 6);
// game.placeCard('10d', 'B', 4, 0);
// game.placeCard('5s', 'B', 3, 1);
// game.placeCard('10c', 'B', 2, 2);
// game.placeCard('9s', 'B', 1, 3);
// game.placeCard('10c', 'B', 0, 4);
// game.placeCard('2d', 'B', 9, 4);
// game.placeCard('7h', 'B', 8, 5);
// game.placeCard('8d', 'B', 7, 6);
// game.placeCard('6d', 'B', 6, 7);
// game.placeCard('ah', 'B', 5, 8);
// game.placeCard('ad', 'B', 1, 0);
// game.placeCard('6s', 'B', 2, 1);
// game.placeCard('qc', 'B', 3, 2);
// game.placeCard('9h', 'B', 4, 3);
// game.placeCard('3h', 'B', 5, 4);
// game.placeCard('ad', 'B', 1, 0);
// game.placeCard('7s', 'B', 1, 1);
// game.placeCard('8s', 'B', 1, 2);
// game.placeCard('9s', 'B', 1, 3);
// game.placeCard('10s', 'B', 1, 4);
// game.printBoard();
// // game.placeCard('2c', 'B', 6, 6);
// console.log('sequence', game.updateSequences(6, 2, 'B'));
// game.placeCard('3h', 'B', 8, 1);

// game.placeCard('2d', 'B', 2, 7);
// game.placeCard('5c', 'B', 1, 8);
// // game.placeCard('4c', 'B', 4, 6);
// console.log('sequence', game.updateSequences(1, 8, 'B'));
// game.printBoard();

module.exports = Consecutive;
