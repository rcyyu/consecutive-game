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
	socket.on("create-room", data => {
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
		socket.emit('created-room', roomID);
	});

	socket.on("join-room", data => {
		if (rooms[data.roomID] != null) {
			if (rooms[data.roomID].numPlayers > Object.keys(rooms[data.roomID].users).length) {
				rooms[data.roomID].users[socket.id] = {
					username: data.username,
					isLeader: false,
					team: null,
					hand: null
				};
				socket.join(data.roomID);
				socket.emit('user-connected', data.roomID);
				if (rooms[data.roomID].leader === null) {
					rooms[data.roomID].users[socket.id].isLeader = true;
					rooms[data.roomID].leader = rooms[data.roomID].users[socket.id].username;
					socket.emit('user-leadered');
				} else {
					socket.emit('identify-leader', rooms[data.roomID].leader);
				}
				socket.to(data.roomID).emit('other-user-connected', data.username);
				if (rooms[data.roomID].numPlayers == Object.keys(rooms[data.roomID].users).length) {
					io.in(data.roomID).emit('game-ready');
				}
			} else {
				socket.emit('full-room');
			}
		} else {
			socket.emit('invalid-room');
		}
	});

	socket.on('start-game', data => {
		try {
			let initTeams = teams[rooms[data.roomID].numTeams];
			const numPlayers = rooms[data.roomID].numPlayers;
			rooms[data.roomID].game = new Consecutive(board, deck, initTeams);
			const playerHandSize = rooms[data.roomID].game.getPlayerHandSize(numPlayers);
			Object.keys(rooms[data.roomID].users).forEach((userSocket, i) => {
				rooms[data.roomID].users[userSocket].team = teamAssignment[i % numPlayers];
				rooms[data.roomID].users[userSocket].hand = rooms[data.roomID].game.getCardStack(playerHandSize);
				io.to(userSocket).emit('player-init', {
					team: rooms[data.roomID].users[userSocket].team,
					hand: rooms[data.roomID].users[userSocket].hand
				});
			});
			rooms[data.roomID].turnManager = new TurnManager(rooms[data.roomID].users);
			io.in(data.roomID).emit('game-started');
			let currTurn = rooms[data.roomID].turnManager.getTurn();
			socket.to(data.roomID).emit('other-player-turn', {
				team: currTurn.team,
				player: currTurn.username
			});
			socket.emit('player-turn');
		} catch(e) {
			console.log(e)
		}
	});

	socket.on('disconnect', () => {
		getUserRooms(socket).forEach(room => {
			// delete user from room
			socket.to(room).emit('other-user-disconnected', rooms[room].users[socket.id].username)
			if (rooms[room].users[socket.id].isLeader && Object.keys(rooms[room].users).length > 1) {
				let newLeader = Object.keys(rooms[room].users)[1]
				rooms[room].users[newLeader].isLeader = true;
				rooms[room].leader = rooms[room].users[newLeader].username;
				io.to(newLeader).emit('user-leadered');
				socket.to(room).emit('identify-leader', rooms[room].leader)
			}
			io.in(room).emit('game-not-ready');
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