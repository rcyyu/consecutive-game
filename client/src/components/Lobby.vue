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
				<Board
					:roomID="roomID"
					:hand="hand"
					:team="team"
				/>
				<Hand :hand="hand" />
			</div>
		</template>
		<template v-if="gameWon">
			<div class='overlay'>
			</div>
			<div class='winMessage'>
				{{ team + ' wins.' }}
			</div>
		</template>
	</div>
</template>
<style lang="scss" scoped>
	.game {
		display: grid;
		grid-template-columns: auto 800px auto;
		grid-template-rows: auto;
		.board {
			grid-column: 2 / 3;
			grid-row: 1 / 2;
		}
		.hand {
			grid-column: 2 / 3;
			grid-row: 2 / 3;
		}
	}
	.overlay {
		width: 100%;
		height: 100%;
		position: absolute;
		top: 0;
		left: 0;
		background-color: gray;
		opacity: 50%;
		z-index: 1;
	}
	.winMessage {
		width: 20%;
		height: 20%;
		position: absolute;
		top: 40%;
		left: 50%;
		transform: translate(-50%, -50%);
		text-align: center;
		background-color: white;
		border: 2px solid black;
		z-index: 2;
	}
</style>
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
				hand: [],
				gameWon: false,
				victor: ''
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
			},
			gameStarted: function() {
				this.gameStarted = true;
			},
			turnSuccess: function(data) {
				const { oldCard, newCard } = data;
				var index = this.hand.indexOf(oldCard);
				if (index !== -1) this.hand.splice(index, 1);
				if (newCard) this.hand.push(newCard);
			},
			gameWon: function({ team }) {
				this.gameWon = true;
				this.victor = team;

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
