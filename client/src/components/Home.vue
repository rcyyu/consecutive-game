<template>
	<div>
        <button v-on:click="createRoom()">Create Room</button>
	</div>
</template>

<script>
    import io from "socket.io-client";
	export default {
		name: 'Home',
		data() {
			return {
                socket: {},
			}
		},
		created() {
			this.socket = io("http://localhost:3000");
        },
        mounted() {
            this.socket.on('created-room', data => {
                this.$router.push('/' + data);
            })
        },
		methods: {
			createRoom() {
                this.socket.emit("create-room", { roomID: this.roomID });
            }
		}
	}
</script>