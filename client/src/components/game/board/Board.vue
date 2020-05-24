<template>
    <div class='board'>
        <template v-for='row in board'>
            <div class='row' :key='row.id'>
                <template v-for='card in row'>
                    <BoardCard
                        class='card'
                        :key='card.id'
                        :card='card.card'
                        :img='card.image'
                        :row='card.row'
                        :col='card.col'
                        :selectable='cardInHand(card.card)'
                        :oneEyeInHand='oneEyeInHand()'
                        :twoEyeInHand='twoEyeInHand()'
                        :team='team'
                        :isPlayerTurn='isPlayerTurn'
                        :roomID='roomID'
                    />
                </template>
            </div>
        </template>
    </div>
</template>
<style lang='scss' scoped>
    .board {
        width: 100%;
        height: 100%;
        max-width: 960px;
        display: grid;
        grid-template-rows: repeat(10, 1fr);
        grid-row-gap: 4px;
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
        team: String,
        isPlayerTurn: Boolean
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
            const index = this.hand.findIndex((handCard) => {
                if (handCard.card == card) {
                    return true;
                }
            });
            return index >= 0;
        },
        oneEyeInHand() {
            const indexJS = this.hand.findIndex((handCard) => {
                if (handCard.card == 'js') {
                    return true;
                }
            });
            const indexJH = this.hand.findIndex((handCard) => {
                if (handCard.card == 'jh') {
                    return true;
                }
            });
            return (indexJS >= 0) || (indexJH >= 0);
        },
        twoEyeInHand() {
            const indexJC = this.hand.findIndex((handCard) => {
                if (handCard.card == 'jc') {
                    return true;
                }
            });
            const indexJD = this.hand.findIndex((handCard) => {
                if (handCard.card == 'jd') {
                    return true;
                }
            });
            return (indexJC >= 0) || (indexJD >= 0);
        }
    }
}
</script>