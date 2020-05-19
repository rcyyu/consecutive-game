import Vue from 'vue';
import VueSocketio from 'vue-socket.io-extended';
import * as io from 'socket.io-client';
import VueRouter from 'vue-router';
import App from './App.vue';
import routes from './routes.js';

Vue.config.productionTip = false;

Vue.use(VueSocketio, io('https://consecutive-game-server.herokuapp.com/'));
Vue.use(VueRouter);

document.title = 'Consecutve';

const router = new VueRouter({
  mode: 'history',
  routes
});

new Vue({
  router,
  render: (h) => h(App)
}).$mount('#app');
