const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const randomWords = require('random-words');
const { uuid } = require('uuidv4');
const deck  = require('./deck');
const board = require('./board');

var position = {
	x: 200,
	y: 200
};

const rooms = {};

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
		rooms[roomID] = { users: {}, numTeams: data.teams, numPlayers: data.players, deck: deck, board: board }
		socket.emit('created-room', roomID);
	});

	socket.on("join-room", data => {
		if (rooms[data.roomID] != null) {
			if (rooms[data.roomID].numPlayers > Object.keys(rooms[data.roomID].users).length) {
				rooms[data.roomID].users[socket.id] = { username: data.username, leader: false, team: null, hand: null };
				socket.join(data.roomID);
				socket.emit('user-connected', data.roomID);
				if (Object.keys(rooms[data.roomID].users).length === 1) {
					rooms[data.roomID].users[socket.id].leader = true;
					socket.emit('user-leadered');
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
		console.log(rooms);
	});

	socket.on('disconnect', () => {
		getUserRooms(socket).forEach(room => {
			// delete user from room
			socket.to(room).emit('other-user-disconnected', rooms[room].users[socket.id].username)
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