import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../components/HomeView.vue'
import GameView from '../components/GameView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/play/:gameId',
      name: 'game',
      component: GameView,
      props: true,
    },
  ],
})

export default router
