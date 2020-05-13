<template>
    <div class="board">
        <template v-for='row in board'>
            <div class="row" :key='row.id'>
                <template v-for='card in row'>
                    <BoardCard
                        class="card"
                        :key="card.id"
                        :card="card.card"
                        :img="card.image"
                        :row="card.row"
                        :col="card.col"
                        :selectable="cardInHand(card.card)"
                        :oneEyeInHand="oneEyeInHand()"
                        :twoEyeInHand="twoEyeInHand()"
                        :team="team"
                        :roomID="roomID"
                    />
                </template>
            </div>
        </template>
    </div>
</template>
<style lang="scss" scoped>
    .board {
        width: 100%;
        height: 100%;
        max-width: 960px;
        display: grid;
        grid-template-rows: repeat(10, 1fr);
    }
    .row {
        display: grid;
        grid-template-columns: repeat(10, 1fr);
        grid-column-gap: 4px;
    }
</style>
<script>
import BoardCard from './BoardCard.vue';
import board from '../../../constants/board.js';
export default {
    name: 'Board',
    props: {
        roomID: String,
        hand: Array,
        team: String
    },
    components: {
        BoardCard
    },
    data() {
        return {
            board: board
        }
    },
    methods: {
        cardInHand(card) {
            return this.hand.indexOf(card) >= 0;
        },
        oneEyeInHand() {
            return (this.hand.indexOf('js') >= 0) || (this.hand.indexOf('jh') >= 0);
        },
        twoEyeInHand() {
            return (this.hand.indexOf('jc') >= 0) || (this.hand.indexOf('jd') >= 0);
        }
    }
}
</script>