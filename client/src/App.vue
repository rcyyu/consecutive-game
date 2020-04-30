<template>
  <div id="app">
    <nav>
        <router-link to='/'>Lobby</router-link>
        <router-link to='/game'>Game</router-link>
    </nav>
    <router-view />
  </div>
</template>

<script>
export default {
}
</script>