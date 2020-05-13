<template>
    <div
        class='boardCard'
        v-on:click="selectCard()"
    >
        <img
            class='cardImg'
            :class="[{ highlight: (highlighted && !occupiedTeam), sequenced: isSequence }, getTeamColour()]"
            :src="require('../../../assets/boardCards/'+img)"
        />
        <div
            v-if="occupiedTeam"
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
        .cardImg {
            max-width: 100%;
            &.highlight {
                outline: 2px dashed #5E9ED6;
                cursor: pointer;
            }
            &.sequenced {
                outline-width: 2px;
                outline-style: solid;
                &.red {
                    outline-color: red;
                }
                &.blue {
                    outline-color: blue;
                }
                &.green {
                    outline-color: green;
                }
            }
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
            row: Number,
            col: Number,
            highlighted: Boolean,
            roomID: String
        },
        data() {
            return {
                occupiedTeam: null,
                isSequence: false
            }
        },
        sockets: {
            cardPlaced: function({ row, col, team }) {
                if (row == this.row && col == this.col) {
                    this.occupiedTeam = team;
                }
            },
            newSequence: function({ sequence, row, col, team }) {
                if (row == this.row && col == this.col) {
                    this.occupiedTeam = team;
                }
                // TODO: fine a faster way to do this
                for (var i = 0; i < sequence.length; i++) {
                    if (sequence[i][0] == this.row && sequence[i][1] == this.col) {
                        this.isSequence = true;
                        break;
                    }
                }
            },
            cardRemoved: function({ row, col }) {
                if (row == this.row && col == this.col) {
                    this.occupiedTeam = null;
                }
            }
        },
        methods: {
            selectCard() {
                if (this.highlighted) {
                    this.$socket.client.emit("selectCard", {
                        roomID: this.roomID,
                        card: this.card,
                        row: this.row,
                        col: this.col
                    });
                }
            },
            getTeamColour() {
                switch(this.occupiedTeam) {
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