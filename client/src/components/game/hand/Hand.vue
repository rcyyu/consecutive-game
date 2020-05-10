<template>
    <div class="hand">
        <template v-for='card in hand'>
            <HandCard
                class='handCard'
                :key='card.id'
                :card='card'
            />
        </template>
    </div>
</template>
<style lang="scss" scoped>
    .hand {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(5%, 80px));
        justify-content: center;
    }
</style>
<script>
import HandCard from './HandCard.vue';
export default {
    name: 'Hand',
    props: {
        hand: Array
    },
    data() {
        return {
            handSize: this.hand.length
        }
    },
    components: {
        HandCard
    }
}
</script>
