<template>
	<div class='game'>
		<PlayerList
			:playerList="playerList"
			:currentPlayerTurn="currentPlayerTurn"
			:playerID="playerID"
		/>
		<Board
			:roomID="roomID"
			:hand="hand"
			:team="team"
			:isPlayerTurn="isPlayerTurn && gameReady && gameStarted"
		/>
		<Hand
			:roomID="roomID"
			:hand="hand"
			:replacedOne="replacedOne"
			:isPlayerTurn="isPlayerTurn"
		/>
		<template v-if="!playerJoined && isValidRoom && !isRoomFull">
			<div class='overlay'></div>
			<div class='messageBox'>
				<form class='form' @submit.prevent>
					Enter a username.
					<input v-model="username" required type="text">
					<button v-on:click="joinRoom(username)" type="submit">Join Room</button>
				</form>
			</div>
		</template>
		<template v-if="gameReady && isLeader && !gameStarted && playerJoined">
			<div class='overlay'></div>
			<div class='messageBox'>
				<button class='message' v-on:click="startGame()">Start Game</button>
			</div>
		</template>
		<template v-if="!gameStarted && playerJoined">
			<template v-if="!isLeader && gameReady">
				<div class='overlay'></div>
				<div class='messageBox'>
					<p class="message">Waiting for {{ leader }} to start game.</p>
				</div>
			</template>
			<template v-if="!gameReady">
				<div class='overlay'></div>
				<div class='messageBox'>
					<p class="message">Waiting for players ...</p>
				</div>
			</template>
		</template>
		<template v-if="gameWon">
			<div class='overlay'></div>
			<div class='messageBox'>
				<div class='message'>
					<p>{{ team + ' wins.' }}</p>
					<button v-on:click="newGame()">Create New Game</button>
				</div>
			</div>
		</template>
		<template v-if="!gameReady && gameStarted">
			<div class='overlay'></div>
			<div class='messageBox'>
				<div class='message'>
					<p>Game ended. A player has left the game.</p>
					<button v-on:click="newGame()">Create New Game</button>
				</div>
			</div>
		</template>
		<template v-if="isRoomFull || !isValidRoom">
			<div class='overlay'></div>
			<div class='messageBox'>
				<div class='message'>
					<p>Cannot join room. Room {{ !isValidRoom ? 'does not exist.' : 'is full.' }}</p>
					<button v-on:click="newGame()">Go to Home</button>
				</div>
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
		.playerList {
			grid-column: 1 / 2;
			grid-row: 1 / 2;
			padding-right: 10px;
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
		.messageBox {
			width: 20%;
			height: 20%;
			position: absolute;
			top: 40%;
			left: 50%;
			transform: translate(-50%, -50%);
			display: flex;
			align-items: center;
			text-align: center;
			background-color: white;
			border: 1px solid gray;
			border-radius: 5px;
			z-index: 2;
			.message {
				margin: auto;
			}
			.form {
				margin: auto;
				input {
					margin: 5px;
					display: block;
				}
				button {
					margin: 5px;
				}
			}
		}
	}
</style>
<script>
	import Board from './game/board/Board.vue';
	import Hand from './game/hand/Hand.vue';
	import PlayerList from './game/playerList/playerList';
	export default {
		name: 'Lobby',
		components: {
			Board,
			Hand,
			PlayerList
		},
		data() {
			return {
				roomID: this.$route.params.room,
				username: null,
				playerID: null,
				isLeader: false,
				leaderID: null,
				playerJoined: false,
				playerList: [],
				gameReady: false,
				gameStarted: false,
				currentPlayerTurn: '',
				isPlayerTurn: false,
				replacedOne: false,
				team: '',
				hand: [],
				gameWon: false,
				victor: '',
				isRoomFull: false,
				isValidRoom: true
			}
		},
		sockets: {
			userConnected: function({ id }) {
				this.playerJoined = true;
				this.playerID = id;
			},
			userLeadered: function() {
				this.isLeader = true;
			},
			identifyLeader: function(data) {
				this.leader = data
			},
			lobbyUpdate: function({ playerList }) {
				this.playerList = playerList;
			},
			gameReady: function() {
				this.gameReady = true;
			},
			otherPlayerTurn: function({ id }) {
				this.currentPlayerTurn = id;
				this.isPlayerTurn = false;
			},
			playerTurn: function() {
				this.isPlayerTurn = true;
			},
			gameNotReady: function() {
				if (this.gameReady) {
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
				const index = this.hand.findIndex((card) => {
					if (card.card == oldCard) {
						return true;
					}
				});
				if (index !== -1) this.hand.splice(index, 1);
				if (newCard) this.hand.push(newCard);
				this.replacedOne = false;
			},
			replacedDeadCard: function({ oldCard, newCard }) {
				const index = this.hand.findIndex((card) => {
					if (card.card == oldCard) {
						return true;
					}
				});
				this.hand.splice(index, 1);
				this.hand.push(newCard);
				this.replacedOne = true;
			},
			deadCard: function({ card }) {
				this.hand.forEach((handCard) => {
					if (handCard.card == card) {
						handCard.isDead = true;
					}
				});
			},
			aliveCard: function({ card }) {
				this.hand.forEach((handCard) => {
					if (handCard.card == card) {
						handCard.isDead = false;
					}
				});
			},
			gameWon: function({ team }) {
				this.gameWon = true;
				this.victor = team;

			},
			fullRoom: function() {
				this.isRoomFull = true;
			},
			invalidRoom: function() {
				this.isValidRoom = false;
			}
		},
		methods: {
			joinRoom(username) {
				if(username) {
					this.$socket.client.emit('joinRoom', { roomID: this.roomID, username: this.username });
				}
			},
			startGame() {
				this.$socket.client.emit('startGame', { roomID: this.roomID });
			},
			newGame() {
				this.$router.push('/');
			}
		}
	}
</script>

<style scoped>
</style>
