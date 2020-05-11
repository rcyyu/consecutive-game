<template>
    <div
        class='boardCard'
        :class="{ sequenced: isSequence }"
        v-on:click="selectCard()"
    >
        <img
            class='cardImg'
            :class="{ highlighted: highlighted }"
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
        &.sequenced {
            outline: 2px solid red;
        }
        .cardImg {
            max-width: 100%;
            &.highlighted {
                outline: 2px dashed #5E9ED6;
                cursor: pointer;
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
            newSequence: function({ newSequence, row, col, team }) {
                if (row == this.row && col == this.col) {
                    this.occupiedTeam = team;
                }
                if (newSequence.indexOf([this.row, this.col]) >= 0) {
                    this.isSequence = true;
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