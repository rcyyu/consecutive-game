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
	socket.on("create-room", () => {
		const roomID = randomWords({ min: 2, max: 4, join:'', formatter: (word, index) => {
			return index === 0 ? word.slice(0,1).toUpperCase().concat(word.slice(1)) : word;
		}});
		rooms[roomID] = { users: {}, deck: deck, board: board }
		socket.emit('created-room', roomID);
	});

	socket.on("join-room", data => {
		// ensure that the exists
		console.log(data)
		if (rooms[data.roomID] != null) {
			rooms[data.roomID].users[socket.id] = { username: data.username, team: null, hand: null };
			socket.join(data.roomID);
			socket.emit('user-connected', data.roomID);
			socket.to(data.roomID).emit('other-user-connected', data.username);
		} else {
			socket.emit('invalid-room');
		}
	});

	socket.emit("position", position);
	socket.on("move", data => {
		console.log(socket.id)
		console.log(data)
		switch(data.direction) {
			case "left":
				data.position.x -= 5;
				io.in(data.roomID).emit("position", data.position);
				break;
			case "right":
				data.position.x += 5;
				io.in(data.roomID).emit("position", data.position);
				break;
			case "up":
				data.position.y -= 5;
				io.in(data.roomID).emit("position", data.position);
				break;
			case "down":
				data.position.y += 5;
				io.in(data.roomID).emit("position", data.position);
				break;
		}
	});

	socket.on('disconnect', () => {
		getUserRooms(socket).forEach(room => {
			// delete user from room
			socket.to(room).emit('other-user-disconnected', rooms[room].users[socket.id].username)
			delete rooms[room].users[socket.id]
			// delete room if empty
			if (Object.keys(rooms[room].users ).length === 0 && rooms[room].users.constructor === Object) {
				console.log("Closed " + room);
				delete rooms[room];
			}
		  });
	});
});

server.listen(3000, () => {
	console.log("Listening at 3000");
});