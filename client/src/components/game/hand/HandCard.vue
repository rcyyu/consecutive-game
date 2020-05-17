<template>
    <div
        class='handCard'
    >
        <img class='img' :src="require('../../../assets/handCards/'+getCardPath())" >
        <template v-if='isDead'>
            <div
                class='dead'
                :class="{ clickable: playerTurn && !replacedOne }"
                v-on:click="replaceDeadCard()"
            >
                <div class='overlay'></div>
                <p class='text'>Dead</p>
                <p class='hoverText'>Replace</p>
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
                width: 100%;
                height: 100%;
                opacity: 50%;
                background-color: red;
                border-radius: 5px;
            }
            .text {
                position: absolute;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
                color: white;
                margin: 0;
            }
            .hoverText {
                position: absolute;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
                color: white;
                margin: 0;
                display: none;
            }
            &.clickable {
                cursor: pointer;
                &:hover {
                    .text {
                        display: none;
                    }
                    .hoverText {
                        display: block;
                    }
                }
            }
        }
    }
</style>
<script>
import CardPaths from '../../../constants/cardPaths.js';
export default {
    name: 'HandCard',
    props: {
        card: String,
        playerTurn: Boolean,
        replacedOne: Boolean,
        index: Number,
        roomID: String
    },
    data() {
        return {
            isDead: false
        }
    },
    watch: {
        card: function(oldCard, newCard) {
            if (oldCard !== newCard) {
                this.isDead = false;
            }
        }
    },
    sockets: {
        deadCard: function({ card }) {
            console.log(card)
            if (card == this.card) {
                console.log('dead')
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
        },
        replaceDeadCard() {
            if (!this.replacedOne) {
                this.$socket.client.emit("replaceDeadCard", {
                    card: this.card,
                    index: this.index,
                    roomID: this.roomID
                });
            }
        }
    }
}
</script>