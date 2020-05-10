<template>
    <div
        class='boardCard'
        :class="{ highlighted: highlighted, sequenced: isSequence }"
        v-on:click="selectCard()"
    >
        <img class='cardImg' :src="require('../../../assets/boardCards/'+img)" >
        <div
            v-if="team"
            class='chip'
            :class="getTeamColour()"
        >
        </div>
    </div>
</template>
<style lang="scss" scoped>
    .boardCard {
        max-width: 100%;
        position: relative;
        .highlighted {
            outline: 2px dashed #5E9ED6;
        }
        .sequenced {
            outline: 2px solid red;
        }
        .cardImg {
            max-width: 100%;
        }
        .chip {
            height: 40px;
            width: 40px;
            border-radius: 50%;
            position: absolute;
            left: 50%;
            top: 50%;
            margin-top: -22px;
            margin-left: -20px;
            &.red {
                background-color: red;
            }
            &.blue {
                background-color: blue;
            }
            &.green {
                background-color: green;
            }
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
            },
            getTeamColour() {
                switch(this.team) {
                    case 'R':
                        return 'red';
                    case 'G':
                        return 'green';
                    case 'B':
                        return 'blue';
                    default:
                        return '';
                }
            }
        }
    }
</script>