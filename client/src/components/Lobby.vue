<template>
	<div>
		<template v-if="!playerJoined">
			<div>
				<input v-model="username" type="text">
				<button v-on:click="joinRoom()">Join Room</button>
			</div>
		</template>
		<template v-if="playerJoined && !gameStarted">
			<div v-for="message in messages" v-bind:key="message.id">
				{{ message }}
			</div>
		</template>
		<template v-if="gameReady && isLeader && !gameStarted">
			<button v-on:click="startGame()">Start Game</button>
		</template>
		<template v-if="gameReady && gameStarted">
			<div class='game'>
				<Board :roomID="roomID" />
				<Hand :hand="hand" />
			</div>
		</template>
	</div>
</template>

<script>
	import Board from './game/board/Board.vue';
	import Hand from './game/hand/Hand.vue';
	export default {
		name: 'Lobby',
		components: {
			Board,
			Hand
		},
		data() {
			return {
				messages: [],
				roomID: this.$route.params.room,
				username: null,
				isLeader: false,
				leaderID: null,
				playerJoined: false,
				gameReady: false,
				gameStarted: false,
				team: '',
				hand: []
			}
		},
		sockets: {
			userConnected: function() {
				this.playerJoined = true;
				this.messages.push('You joined');
			},
			otherUserConnected: function(data) {
				this.messages.push(data + ' joined');
			},
			otherUserDisconnected: function(data) {
				this.messages.push(data + ' disconnected');
			},
			userLeadered: function() {
				this.isLeader = true;
				this.messages.push('You are the leader.');
			},
			identifyLeader: function(data) {
				this.leader = data
				this.messages.push(data + ' is the leader.')
			},
			gameReady: function() {
				this.messages.push('Game is ready to begin. Waiting for ' + (this.isLeader ? 'you' : this.leader) + ' to start the game.');
				this.gameReady = true;
			},
			otherPlayerTurn: function(data) {
				this.messages.push(data.player + ' of ' + data.team + ' is playing.');
			},
			playerTurn: function() {
				this.messages.push('Your turn');
			},
			gameNotReady: function() {
				if (this.gameReady) {
					this.messages.push('Game is not ready.')
					this.gameReady = false;
				}
			},
			playerInit: function(data) {
				this.team = data.team;
				this.hand = data.hand;
				console.log(data.hand)
			},
			gameStarted: function() {
				this.gameStarted = true;
			},
			fullRoom: function() {
				this.messages.push('Cannot join room. Room is full.')
			},
			invalidRoom: function() {
				this.messages.push('Cannot join room. Room does not exist.')
			}
		},
		methods: {
			joinRoom() {
				this.$socket.client.emit('joinRoom', { roomID: this.roomID, username: this.username });
			},
			startGame() {
				this.$socket.client.emit('startGame', { roomID: this.roomID });
			}
		}
	}
</script>

<style scoped>
</style>
