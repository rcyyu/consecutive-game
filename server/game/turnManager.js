class PlayerNode {
    constructor(socket, username, team, next=null) {
        this.socket = socket;
        this.username = username;
        this.team = team;
        this.next = next;
    }
}

class TurnManager {
    constructor(players) {
        this.head = this.initPlayerLoop(players);
        this.currTurn = this.head;
    }

    initPlayerLoop(players) {
        const sockets = Object.keys(players);
        let prevNode = new PlayerNode(sockets[0], players[sockets[0]].username, players[sockets[0]].team);
        let firstNode = prevNode;
        for (let i = 1; i < sockets.length; i++) {
            let currNode = new PlayerNode(sockets[i], players[sockets[i]].username, players[sockets[i]].team);
            prevNode.next = currNode;
            prevNode = currNode;
        }
        firstNode.prev = prevNode;
        return firstNode;
    }

    nextTurn() {
        this.currTurn = this.currTurn.next;
        return this.currTurn;
    }

    getTurn() {
        return this.currTurn;
    }
}

module.exports = TurnManager;
