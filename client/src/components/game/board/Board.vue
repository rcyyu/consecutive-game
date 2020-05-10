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
                        :team="card.team"
                        :isSequence="card.isSequence"
                        :row="card.row"
                        :col="card.col"
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
        grid-row-gap: 2px;
    }
    .row {
        display: grid;
        grid-template-columns: repeat(10, 1fr);
        grid-column-gap: 2px;
    }
</style>
<script>
import BoardCard from './BoardCard.vue';
import board from '../../../constants/board.js';
export default {
    name: 'Board',
    props: {
        roomID: String
    },
    components: {
        BoardCard
    },
    data() {
        return {
            board: board
        }
    }
}
</script>