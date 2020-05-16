<template>
    <div
        class='handCard'
    >
        <img class='img' :src="require('../../../assets/handCards/'+getCardPath())" >
        <template v-if='isDead'>
            <div class='dead' v-on:click="removeDeadCard()">
                <div class='overlay'></div>
                <p class='text'>Dead Card</p>
                <p class='hoverText'>Remove</p>
            </div>
        </template>
    </div>
</template>
<style lang="scss" scoped>
    .handCard {
        max-width: 100%;
        position: relative;
        .img {
            max-width: 100%;
            display: block;
        }
        .dead {
            width: 100%;
            height: 100%;
            position: absolute;
            top: 0;
            left: 0;
            .overlay {
                opacity: 50%;
                background-color: red;
                border-radius: 5px;
            }
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
    data() {
        return {
            isDead: false
        }
    },
    sockets: {
        deadCard: function({ card }) {
            if (card == this.card) {
                this.isDead = true;
            }
        },
        aliveCard: function({ card }) {
            if (card == this.card) {
                this.isDead = false;
            }
        }
    },
    methods: {
        getCardPath() {
            return CardPaths[this.card];
        }
    }
}
</script>