<template>
    <div class="board">
        <template v-for='row in board'>
            <template v-for='card in row'>
                <BoardCard 
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
        </template>
    </div>
</template>
<script>
import BoardCard from './BoardCard.vue';
import board from '../../constants/board.js';
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