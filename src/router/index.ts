import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../components/HomeView.vue'
import TetrisView from '../components/TetrisView.vue'
import SnakeView from '../components/SnakeView.vue'

/**
 * Vue Router 路由配置
 * - / 首页 - 游戏选择列表
 * - /play/tetris 俄罗斯方块游戏页面
 * - /play/snake 贪吃蛇游戏页面
 */
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
