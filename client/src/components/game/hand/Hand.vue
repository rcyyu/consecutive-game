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
<script>
import HandCard from './HandCard.vue';
export default {
    name: 'Hand',
    props: {
        hand: Array
    },
    components: {
        HandCard
    }
}
</script>
