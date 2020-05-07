import Vue from 'vue';
import Vuex from 'vuex';
import VueSocketio from 'vue-socket.io';
import VueRouter from 'vue-router';
import App from './App.vue';
import routes from './routes.js';

Vue.use(Vuex);
Vue.use(VueSocketio, 'http://localhost:3000');
Vue.use(VueRouter);

const router = new VueRouter({
  mode: 'history',
  routes
});

new Vue({
  router,
  render: (h) => h(App)
}).$mount('#app');
