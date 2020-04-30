import Home from  './components/Home.vue';
import Lobby from './components/Lobby.vue';

const routes = [
    { path: '/', component: Home },
    { path: '/:room', component: Lobby },
]

export default routes;