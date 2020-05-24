<template>
    <div class='playerList'>
        <template v-for='player in playerList'>
            <Player
                :key='player.id'
                :username='player.username'
                :id='player.id'
                :team='player.team'
                :currentPlayerTurn='currentPlayerTurn'
                :isPlayer='player.id === playerID'
            />
        </template>
    </div>
</template>
<style lang='scss' scoped>
    .playerList {
        width: 90%;
        height: 100%;
        max-width: 150px;
        display: grid;
        grid-template-columns: 1;
        grid-template-rows: repeat(12, 1fr);
        grid-row-gap: 6px;
    }
</style>
<script>
import Player from './player.vue';
export default {
    name: 'PlayerList',
    props: {
        playerList: Array,
        currentPlayerTurn: String,
        playerID: String
    },
    components: {
        Player
    }
}
</script>