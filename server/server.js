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

io.on("connection", socket => {
	socket.on("createRoom", data => {
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

	socket.on("joinRoom", data => {
		if (rooms[data.roomID] != null) {
			if (rooms[data.roomID].numPlayers > Object.keys(rooms[data.roomID].users).length) {
				rooms[data.roomID].users[socket.id] = {
					username: data.username,
					isLeader: false,
					team: null,
					hand: null
				};
				socket.join(data.roomID);
				socket.emit('userConnected', data.roomID);
				if (rooms[data.roomID].leader === null) {
					rooms[data.roomID].users[socket.id].isLeader = true;
					rooms[data.roomID].leader = rooms[data.roomID].users[socket.id].username;
					socket.emit('userLeadered');
				} else {
					socket.emit('identifyLeader', rooms[data.roomID].leader);
				}
				socket.to(data.roomID).emit('otherUserConnected', data.username);
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
			let initTeams = teams[rooms[data.roomID].numTeams];
			const numPlayers = rooms[data.roomID].numPlayers;
			rooms[data.roomID].game = new Consecutive(board, deck, initTeams);
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
			rooms[data.roomID].turnManager = new TurnManager(rooms[data.roomID].users);
			io.in(data.roomID).emit('gameStarted');
			let currTurn = rooms[data.roomID].turnManager.getTurn();
			io.in(data.roomID).emit('otherPlayerTurn', {
				team: currTurn.team,
				player: currTurn.username
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
				if (rooms[roomID].users[socket.id].hand.indexOf(card) >= 0) {
					if (card in rooms[roomID].game.oneEyedJacks) {
						let cardRemoved = rooms[roomID].game.removeCard(card, playerTeam, row, col);
						if (cardRemoved) {
							io.in(roomID).emit('cardRemoved', {
								row: row,
								col: col
							});
							const index = rooms[roomID].users[socket.id].hand.indexOf(card);
							if (index !== -1) rooms[roomID].users[socket.id].hand.splice(index, 1);
							const newCard = rooms[roomID].game.getCard();
							rooms[roomID].users[socket.id].hand.push(newCard);
							socket.emit('turnSuccess', {
								oldCard: card,
								newCard: newCard
							});
							const nextTurn = rooms[data.roomID].turnManager.nextTurn();
							io.in(roomID).emit('otherPlayerTurn', {
								team: nextTurn.team,
								player: nextTurn.username
							});
							io.to(nextTurn.socket).emit('playerTurn');
						}
					} else {
						let cardPlaced = rooms[roomID].game.placeCard(card, playerTeam, row, col);
						console.log(cardPlaced)
						console.log(card)
						if (!cardPlaced) {
							rooms[roomID].game.printBoard();
						}
						if (cardPlaced) {
							const newSequence = rooms[roomID].game.updateSequences(row, col, playerTeam);
							console.log(newSequence);
							if (!newSequence || !newSequence.length) {
								console.log('placed')
								io.in(roomID).emit('cardPlaced', {
									row: row,
									col: col,
									team: playerTeam
								});
							} else {
								console.log('sequenced')
								io.in(roomID).emit('newSequence', {
									newSequence: newSequence,
									row: row,
									col: col,
									team: playerTeam
								});
							}
							const index = rooms[roomID].users[socket.id].hand.indexOf(card);
							if (index !== -1) rooms[roomID].users[socket.id].hand.splice(index, 1);
							const newCard = rooms[roomID].game.getCard();
							rooms[roomID].users[socket.id].hand.push(newCard);
							socket.emit('turnSuccess', {
								oldCard: card,
								newCard: newCard
							});
							const nextTurn = rooms[data.roomID].turnManager.nextTurn();
							io.in(roomID).emit('otherPlayerTurn', {
								team: nextTurn.team,
								player: nextTurn.username
							});
							io.to(nextTurn.socket).emit('playerTurn');
						}
					}
					socket.emit('validation', {
						hand: rooms[roomID].users[socket.id].hand
					})
				}
			}
		} catch(e) {
			
		}
	});

	socket.on('disconnect', () => {
		getUserRooms(socket).forEach(room => {
			// delete user from room
			socket.to(room).emit('otherUserDisconnected', rooms[room].users[socket.id].username)
			if (rooms[room].users[socket.id].isLeader && Object.keys(rooms[room].users).length > 1) {
				let newLeader = Object.keys(rooms[room].users)[1]
				rooms[room].users[newLeader].isLeader = true;
				rooms[room].leader = rooms[room].users[newLeader].username;
				io.to(newLeader).emit('userLeadered');
				socket.to(room).emit('identifyLeader', rooms[room].leader)
			}
			io.in(room).emit('gameNotReady');
			delete rooms[room].users[socket.id]
			// delete room if empty
			if (Object.keys(rooms[room].users).length === 0 && rooms[room].users.constructor === Object) {
				console.log("Closed " + room);
				delete rooms[room];
			}
		  });
	});
});

server.listen(3000, () => {
	console.log("Listening at 3000");
});