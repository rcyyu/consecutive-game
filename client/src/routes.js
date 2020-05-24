import Home from  './components/Home.vue';
import Game from './components/Game.vue';

const routes = [
    { path: '/', component: Home },
    { path: '/:room', component: Game },
]

export default routes;