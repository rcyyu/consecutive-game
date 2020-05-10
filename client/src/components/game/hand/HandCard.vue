<template>
    <div
        class='handCard'
    >
        <img class='cardImg' :src="require('../../../assets/handCards/'+getCardPath())" >
    </div>
</template>
<style lang="scss" scoped>
    .handCard {
        max-width: 100%;
        position: relative;
        .cardImg {
            max-width: 100%;
        }
    }
</style>
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