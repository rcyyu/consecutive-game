<template>
	<div class="home">
		<h1>Consecutive</h1>
		<h2>An online version of Sequence</h2>
		<form class="setup" @submit.prevent>
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
		</form>
	</div>
</template>
<style lang="scss" scoped>
	.home {
		width: 100%;
		height: 100%;
		h1, h2 {
			text-align: center;
		}
		.setup {
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
		}
		select, button {
			width: 250px;
			display: block;
			margin: 10px auto;
		}
	}
</style>
<script>
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
			}
		},
		sockets: {
			roomCreated: function(data) {
				this.$router.push('/' + data);
			}
		},
		methods: {
			onChange() {
				this.players = null;
			},
			createRoom() {
                this.$socket.client.emit("createRoom", {
					teams: this.teams,
					players: this.players
				});
            }
		}
	}
</script>