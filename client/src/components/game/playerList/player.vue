<template>
    <div
        class="player"
        :class="{ currentTurn: id == currentPlayerTurn }"
    >
        <div class="username">
            {{ username  + (isPlayer ? " (You)" : "")}}
        </div>
        <div
            class="team"
            :class="[getTeamColour()]"
        ></div>
    </div>
</template>
<style lang="scss" scoped>
    .player {
        width: 100%;
        height: 100%;
        position: relative;
        outline: 2px solid white;
        border: 1px solid lightgray;
        .username {
            height: 100%;
            width: calc(100% - 30px);;
            position: absolute;
            top: 50%;
            transform: translateY(-25%);
            margin: 0 10px;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
        }
        .team {
            position: absolute;
            right: 0;
            top: 0;
            width: 20px;
            height: 100%;
            &.red {
                background-color: red;
            }
            &.blue {
                background-color: blue;
            }
            &.green {
                background-color: green;
            }
        }
        &.currentTurn {
            outline: 2px solid black;
        }
    }
</style>
<script>
export default {
    name: 'Player',
    props: {
        username: String,
        id: String,
        team: String,
        currentPlayerTurn: String,
        isPlayer: Boolean
    },
    methods: {
        getTeamColour() {
            switch(this.team) {
                case 'R':
                    return 'red';
                case 'G':
                    return 'green';
                case 'B':
                    return 'blue';
                default:
                    return '';
            }
        }
    }
}
</script>