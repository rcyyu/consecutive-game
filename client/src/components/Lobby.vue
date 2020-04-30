<template>
	<div>
		<input v-model="username" type="text">
		<button v-on:click="joinRoom()">Join Room</button>
		<div v-for="message in messages" v-bind:key="message.id">
			{{ message }}
		</div>
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
				username: sessionStorage.getItem('username')
			}
		},
		created() {
			this.socket = io("http://localhost:3000");
		},
		mounted() {
			this.socket.on('user-connected', () => {
				this.messages.push('You joined');
			});
			this.socket.on('other-user-connected', data => {
				this.messages.push(data + ' joined');
			});
			this.socket.on('other-user-disconnected', data => {
				this.messages.push(data + ' disconnected');
			});
			this.socket.on('invalid-room', () => {
				this.messages.push('Cannot join room. Room does not exist.')
			})
		},
		methods: {
			joinRoom() {
				this.socket.emit('join-room', { roomID: this.roomID, username: this.username })
			}
		}
	}
</script>

<style scoped>
</style>
