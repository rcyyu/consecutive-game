<template>
	<div>
		<select v-model="teams" @change="onChange()">
			<option
				:value="null"
				disabled
				selected
				hidden
			>
				Select Number of Teams
			</option>
			<option
				v-for="teamSize in teamOptions"
				v-bind:key="teamSize.id"
			>
				{{ teamSize }}
			</option>
		</select>
		<select v-model="players" :disabled="teams === null">
			<option
				:value="null"
				disabled
				selected
				hidden
			>
				Select Number of Players
			</option>
			<option
				v-for="numPlayers in playerOptions[teams]"
				v-bind:key="numPlayers.id"
			>
				{{ numPlayers }}
			</option>
		</select>
        <button
			v-on:click="createRoom()"
			:disabled="teams === null || players === null"
		>
			Create Room
		</button>
	</div>
</template>

<script>
    import io from "socket.io-client";
	export default {
		name: 'Home',
		data() {
			return {
				teamOptions: [2, 3],
				playerOptions: {
					2: [2, 4, 6, 8, 10, 12],
					3: [3, 6, 9, 12]
				},
				teams: null,
				players: null,
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
			onChange() {
				this.players = null;
			},
			createRoom() {
                this.socket.emit("create-room", {
					teams: this.teams,
					players: this.players
				});
            }
		}
	}
</script>