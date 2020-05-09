<template>
    <div
        class='boardCard'
        v-bind:class="{ highlighted: highlighted, sequenced: isSequence }"
        v-on:click="selectCard()"
    >
        <img class='cardImg' :src="require('../../assets/cards/'+img)" >
    </div>
</template>
<style lang="scss" scoped>
    .boardCard {
        max-width: 100%;
        .cardImg {
            max-width: 100%;
        }
        .highlighted {
            border: 2px solid #5E9ED6
        }
    }
</style>
<script>
    export default {
        name: 'BoardCard',
        props: {
            card: String,
            img: String,
            team: String,
            isSequence: Boolean,
            row: Number,
            col: Number,
            highlighted: Boolean,
            roomID: String
        },
        sockets: {
            
        },
        methods: {
            selectCard() {
                this.$socket.client.emit("selectCard", {
					teams: this.teams,
					players: this.players
				});
            }
        }
    }
</script>