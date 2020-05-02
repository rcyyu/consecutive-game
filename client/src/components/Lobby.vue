<template>
	<div>
		<template v-if="!playerJoined">
			<div>
				<input v-model="username" type="text">
				<button v-on:click="joinRoom()">Join Room</button>
			</div>
		</template>
		<template v-if="playerJoined">
			<div v-for="message in messages" v-bind:key="message.id">
				{{ message }}
			</div>
		</template>
		<template v-if="gameReady && isLeader">
			<button v-on:click="startGame()">Start Game</button>
		</template>
	</div>
</template>

<script>
	import io from "socket.io-client";

	export default {
		name: 'Lobby',
		data() {
			return {
				socket: {},
				context: {},
				messages: [],
				roomID: this.$route.params.room,
				username: null,
				isLeader: false,
				leaderID: null,
				playerJoined: false,
				gameReady: false
			}
		},
		created() {
			this.socket = io("http://localhost:3000");
		},
		mounted() {
			this.socket.on('user-connected', () => {
				this.playerJoined = true;
				this.messages.push('You joined');
			});
			this.socket.on('other-user-connected', data => {
				this.messages.push(data + ' joined');
			});
			this.socket.on('other-user-disconnected', data => {
				this.messages.push(data + ' disconnected');
			});
			this.socket.on('user-leadered', () => {
				this.isLeader = true;
				this.messages.push('You are the leader.');
			});
			this.socket.on('identify-leader', data => {
				this.leader = data
				this.messages.push(data + ' is the leader.')
			});
			this.socket.on('game-ready', () => {
				this.messages.push('Game is ready to begin. Waiting for ' + (this.isLeader ? 'you' : this.leader) + ' to start the game.');
				this.gameReady = true;
			});
			this.socket.on('game-not-ready', () => {
				if (this.gameReady) {
					this.messages.push('Game is not ready.')
					this.gameReady = false;
				}
			})
			this.socket.on('full-room', () => {
				this.messages.push('Cannot join room. Room is full.')
			});
			this.socket.on('invalid-room', () => {
				this.messages.push('Cannot join room. Room does not exist.')
			});
		},
		methods: {
			joinRoom() {
				this.socket.emit('join-room', { roomID: this.roomID, username: this.username });
			},
			startGame() {
				this.socket.emit('start-game', { roomID: this.roomID });
			}
		}
	}
</script>

<style scoped>
</style>
