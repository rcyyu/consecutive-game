const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const randomWords = require('random-words');
const { uuid } = require('uuidv4');
const deck  = require('./game/deck');
const board = require('./game/board');
const Consecutive = require('./game/consecutive');
const TurnManager = require('./game/turnManager.js');
const { teams, teamAssignment } = require('./game/teams');

const rooms = {};

// Gets all the rooms the user is in
function getUserRooms(socket) {
	return Object.entries(rooms).reduce((names, [name, room]) => {
		if (room.users[socket.id] != null) names.push(name)
		return names
	}, [])
}

function findCard(hand, card) {
	return hand.find((handCard) => {
		if (handCard.card == card) {
			return true;
		}
	});
}

function findCardIndex(hand, card) {
	return hand.findIndex((handCard) => {
		if (handCard.card == card) {
			return true;
		}
	});
}

io.on('connection', socket => {
	socket.on('createRoom', data => {
		const roomID = randomWords({ min: 2, max: 4, join:'', formatter: (word, index) => {
			return index === 0 ? word.slice(0,1).toUpperCase().concat(word.slice(1)) : word;
		}});
		rooms[roomID] = {
			users: {},
			leader: null,
			numTeams: data.teams,
			numPlayers: data.players,
			game: null,
			turnManager: null
		}
		socket.emit('roomCreated', roomID);
	});

	socket.on('joinRoom', data => {
		if (rooms[data.roomID] != null) {
			if (rooms[data.roomID].numPlayers > Object.keys(rooms[data.roomID].users).length) {
				rooms[data.roomID].users[socket.id] = {
					username: data.username,
					id: uuid(),
					isLeader: false,
					team: null,
					hand: null
				};
				socket.join(data.roomID);
				socket.emit('userConnected', { id: rooms[data.roomID].users[socket.id].id });
				if (rooms[data.roomID].leader === null) {
					rooms[data.roomID].users[socket.id].isLeader = true;
					rooms[data.roomID].leader = rooms[data.roomID].users[socket.id].username;
					socket.emit('userLeadered');
				} else {
					socket.emit('identifyLeader', rooms[data.roomID].leader);
				}
				const playerList = Object.values(rooms[data.roomID].users).map(({ username, id, team }) => (
					{ username: username, id: id, team: team, currentTurn: false }
				));
				io.in(data.roomID).emit('lobbyUpdate', {
					playerList: playerList
				});
				if (rooms[data.roomID].numPlayers == Object.keys(rooms[data.roomID].users).length) {
					io.in(data.roomID).emit('gameReady');
				}
			} else {
				socket.emit('fullRoom');
			}
		} else {
			socket.emit('invalidRoom');
		}
	});

	socket.on('startGame', data => {
		try {
			let initTeams = JSON.parse(JSON.stringify(teams[rooms[data.roomID].numTeams]));
			const numPlayers = rooms[data.roomID].numPlayers;
			// Deep copy (not very elegant)
			let newBoard = JSON.parse(JSON.stringify(board));
			let newDeck = JSON.parse(JSON.stringify(deck));
			rooms[data.roomID].game = new Consecutive(newBoard, newDeck, initTeams);
			rooms[data.roomID].game.shuffleDeck();
			const playerHandSize = rooms[data.roomID].game.getPlayerHandSize(numPlayers);
			Object.keys(rooms[data.roomID].users).forEach((userSocket, i) => {
				rooms[data.roomID].users[userSocket].team = teamAssignment[i % numPlayers];
				rooms[data.roomID].users[userSocket].hand = rooms[data.roomID].game.getCardStack(playerHandSize);
				io.to(userSocket).emit('playerInit', {
					team: rooms[data.roomID].users[userSocket].team,
					hand: rooms[data.roomID].users[userSocket].hand
				});
			});
			const playerList = Object.values(rooms[data.roomID].users).map(({ username, id, team }) => (
				{ username: username, id: id, team: team, currentTurn: false }
			));
			io.in(data.roomID).emit('lobbyUpdate', {
				playerList: playerList
			});
			rooms[data.roomID].turnManager = new TurnManager(rooms[data.roomID].users);
			io.in(data.roomID).emit('gameStarted');
			let currTurn = rooms[data.roomID].turnManager.getTurn();
			io.in(data.roomID).emit('otherPlayerTurn', {
				team: currTurn.team,
				id: currTurn.id
			});
			io.to(currTurn.socket).emit('playerTurn');
		} catch(e) {
			console.log(e)
		}
	});

	socket.on('selectCard', data => {
		try {
			const { card, row, col, roomID } = data;
			if (rooms[roomID].turnManager.getTurn().socket === socket.id) {
				const playerTeam = rooms[roomID].users[socket.id].team;
				let twoEyedCard = '';
				if (!findCard(rooms[roomID].users[socket.id].hand, card)) {
					if (findCard(rooms[roomID].users[socket.id].hand, 'jd')) {
						twoEyedCard = 'jd';
					} else if (findCard(rooms[roomID].users[socket.id].hand), 'jc') {
						twoEyedCard = 'jc';
					}
				}
				const cardUsed = (twoEyedCard !== '') ? twoEyedCard : card; 
				if (findCard(rooms[roomID].users[socket.id].hand, cardUsed)) {
					const cardPlaced = rooms[roomID].game.placeCard(cardUsed, playerTeam, row, col);
					if (!cardPlaced) {
						rooms[roomID].game.printBoard();
					}
					if (cardPlaced) {
						let updateSequences = rooms[roomID].game.updateSequences(row, col, playerTeam);
						updateSequences.then((newSequences) => {
							if (!newSequences || !newSequences.length) {
								io.in(roomID).emit('cardPlaced', {
									row: row,
									col: col,
									team: playerTeam
								});
							} else {
								for (let i = 0; i < newSequences.length; i++) {
									io.in(roomID).emit('newSequence', {
										sequence: newSequences[i],
										row: row,
										col: col,
										team: playerTeam
									});
								}
								if (rooms[roomID].game.teams[playerTeam].sequences >= 2) {
									io.in(roomID).emit('gameWon', {
										team: playerTeam
									});
								}
							}
							const isNewDeadCard = rooms[roomID].game.isDeadCard(card);
							if (isNewDeadCard) {
								io.in(roomID).emit('deadCard', {
									card: card
								});
							} else {
								io.in(roomID).emit('aliveCard', {
									card: card
								});
							}

							const index = findCardIndex(rooms[roomID].users[socket.id].hand, cardUsed);
							if (index !== -1) rooms[roomID].users[socket.id].hand.splice(index, 1);
							const newCard = rooms[roomID].game.getCard();
							rooms[roomID].users[socket.id].hand.push(newCard);
							socket.emit('turnSuccess', {
								oldCard: cardUsed,
								newCard: newCard
							});
							const nextTurn = rooms[data.roomID].turnManager.nextTurn();
							io.in(roomID).emit('otherPlayerTurn', {
								team: nextTurn.team,
								id: nextTurn.id
							});
							io.to(nextTurn.socket).emit('playerTurn');
						});
					}
				}
			}
		} catch(e) {
			console.log(e);
		}
	});

	socket.on('removeCard', data => {
		try {
			const { row, col, roomID } = data;
			if (rooms[roomID].turnManager.getTurn().socket === socket.id) {
				const playerTeam = rooms[roomID].users[socket.id].team;
				let oneEyedCard = '';
				if (findCard(rooms[roomID].users[socket.id].hand, 'js')) {
					oneEyedCard = 'js';
				} else if (findCard(rooms[roomID].users[socket.id].hand, 'jh')) {
					oneEyedCard = 'jh';
				}
				if (oneEyedCard !== '') {
					const cardRemoved = rooms[roomID].game.removeCard(oneEyedCard, playerTeam, row, col);
					if (cardRemoved) {
						io.in(roomID).emit('cardRemoved', {
							row: row,
							col: col
						});
						const index = findCardIndex(rooms[roomID].users[socket.id].hand, oneEyedCard);
						if (index !== -1) rooms[roomID].users[socket.id].hand.splice(index, 1);
						const newCard = rooms[roomID].game.getCard();
						rooms[roomID].users[socket.id].hand.push(newCard);
						socket.emit('turnSuccess', {
							oldCard: oneEyedCard,
							newCard: newCard
						});
						const nextTurn = rooms[data.roomID].turnManager.nextTurn();
						io.in(roomID).emit('otherPlayerTurn', {
							team: nextTurn.team,
							id: nextTurn.id
						});
						io.to(nextTurn.socket).emit('playerTurn');
					}
				}
			}
		} catch(e) {
			console.log(e);
		}
	});

	socket.on('replaceDeadCard', ({ card, roomID }) => {
		if (rooms[roomID].turnManager.getTurn().socket === socket.id) {
			if (findCard(rooms[roomID].users[socket.id].hand, card) && rooms[roomID].game.isDeadCard(card)) {
				const index = findCardIndex(rooms[roomID].users[socket.id].hand, card);
				rooms[roomID].users[socket.id].hand.splice(index, 1);
				const newCard = rooms[roomID].game.getCard();
				rooms[roomID].users[socket.id].hand.push(newCard);
				socket.emit('replacedDeadCard', {
					oldCard: card,
					newCard: newCard
				});
			}
		}
	});

	socket.on('disconnect', () => {
		getUserRooms(socket).forEach(room => {
			// delete user from room
			if (rooms[room].users[socket.id].isLeader && Object.keys(rooms[room].users).length > 1) {
				let newLeader = Object.keys(rooms[room].users)[1]
				rooms[room].users[newLeader].isLeader = true;
				rooms[room].leader = rooms[room].users[newLeader].username;
				io.to(newLeader).emit('userLeadered');
				socket.to(room).emit('identifyLeader', rooms[room].leader)
			}
			io.in(room).emit('gameNotReady');
			delete rooms[room].users[socket.id]
			const playerList = Object.values(rooms[room].users).map(({ username, id, team }) => (
				{ username: username, id: id, team: team, currentTurn: false }
			));
			io.in(room).emit('lobbyUpdate', {
				playerList: playerList
			});
			// delete room if empty
			if (Object.keys(rooms[room].users).length === 0 && rooms[room].users.constructor === Object) {
				console.log('Closed ' + room);
				delete rooms[room];
			}
		  });
	});
});

server.listen(process.env.PORT || 3000, () => {
	console.log('Listening at 3000');
});