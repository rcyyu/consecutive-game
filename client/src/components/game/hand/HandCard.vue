<template>
    <div
        class='handCard'
    >
        <img class='cardImg' :src="require('../../../assets/handCards/'+getCardPath())" >
    </div>
</template>
<script>
import CardPaths from '../../../constants/cardPaths.js';
export default {
    name: 'HandCard',
    props: {
        card: String
    },
    methods: {
        getCardPath() {
            return CardPaths[this.card];
        }
    }
}
</script>