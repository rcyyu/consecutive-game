<template>
    <div
        class='boardCard'
        v-on:click="cardClick()"
    >
        <img
            class='img'
            :class="[{
                select: (!occupiedTeam && selectable),
                selectAny: (!occupiedTeam && twoEyeInHand && !selectable),
                remove: (oneEyeInHand && !isSequence && occupiedTeam && (occupiedTeam !== team)),
                sequenced: isSequence }, getTeamColour()]"
            :src="require('../../../assets/boardCards/'+img)"
        />
        <div
            v-if="occupiedTeam"
            class='chip'
            :class="[getTeamColour(), { remove: (oneEyeInHand && !isSequence && occupiedTeam && (occupiedTeam !== team)) }]"
        >
        </div>
    </div>
</template>
<style lang="scss" scoped>
    .boardCard {
        max-width: 100%;
        position: relative;
        .img {
            max-width: 100%;
            display: block;
            &.select {
                outline: 2px dashed #5E9ED6;
                cursor: pointer;
            }
            &.selectAny {
                outline: 2px dotted #19B53E;
                cursor: pointer;
            }
            &.remove {
                outline: 2px dotted #FF675C;
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
            &.remove {
                cursor: pointer;
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
            selectable: Boolean,
            oneEyeInHand: Boolean,
            twoEyeInHand: Boolean,
            team: String,
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
            cardClick() {
                if (!this.occupiedTeam && (this.selectable || this.twoEyeInHand)) {
                    this.$socket.client.emit("selectCard", {
                        roomID: this.roomID,
                        card: this.card,
                        row: this.row,
                        col: this.col
                    });
                } else if (this.oneEyeInHand && !this.isSequence && this.occupiedTeam && this.occupiedTeam != this.team) {
                    this.$socket.client.emit("removeCard", {
                        roomID: this.roomID,
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