import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../components/HomeView.vue'
import TetrisView from '../components/TetrisView.vue'
import SnakeView from '../components/SnakeView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/play/tetris',
      name: 'tetris',
      component: TetrisView,
    },
    {
      path: '/play/snake',
      name: 'snake',
      component: SnakeView,
    },
  ],
})

export default router
