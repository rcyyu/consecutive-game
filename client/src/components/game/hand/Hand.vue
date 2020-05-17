<template>
    <div class="hand">
        <template v-for='(card, index) in hand'>
            <HandCard
                class='handCard'
                :key='index'
                :card='card'
                :playerTurn="playerTurn"
                :replacedOne="replacedOne"
                :index='index'
                :roomID="roomID"
            />
        </template>
    </div>
</template>
<style lang="scss" scoped>
    .hand {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(5%, 80px));
        justify-content: center;
        padding: 10px;
    }
</style>
<script>
import HandCard from './HandCard.vue';
export default {
    name: 'Hand',
    props: {
        hand: Array,
        playerTurn: Boolean,
        replacedOne: Boolean,
        roomID: String
    },
    data() {
        return {
            handSize: this.hand.length,
        }
    },
    components: {
        HandCard
    }
}
</script>
