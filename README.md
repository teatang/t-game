# T Game - 迷你游戏合集

一个使用 Vue 3 + TypeScript + PixiJS + Pinia 构建的迷你游戏网站，包含两款经典游戏：俄罗斯方块和贪吃蛇。

## 游戏列表

### 俄罗斯方块 (Tetris)
经典的方块堆叠益智游戏。移动和旋转下落的方块，填满一行即可消除。

### 贪吃蛇 (Snake)
经典的贪吃蛇游戏。控制蛇的方向，吃掉食物增长蛇身，注意不要撞到墙壁或自己的身体。

## 技术栈

- **Vue 3.5** - 渐进式 JavaScript 框架
- **TypeScript 5.9** - JavaScript 的超集，提供类型检查
- **Vite 8** - 下一代前端构建工具
- **PixiJS 8** - 高性能的 2D 图形渲染引擎
- **Pinia** - Vue 的状态管理库
- **Vue Router 5** - Vue.js 官方路由管理器
- **pnpm** - 快速、节省空间的包管理器

## 开始使用

### 安装依赖

```bash
pnpm install
```

### 开发模式

```bash
pnpm dev
```

启动开发服务器，访问 http://localhost:5173

### 构建生产版本

```bash
pnpm build
```

### 预览生产构建

```bash
pnpm preview
```

## 操作说明

### 俄罗斯方块
- **方向键 / WASD** - 移动和旋转方块
- **空格键** - 快速下落
- **P / Esc** - 暂停游戏

### 贪吃蛇
- **方向键 / WASD** - 控制蛇的移动方向
- **P / Esc** - 暂停游戏

## 项目结构

```
src/
├── components/          # Vue 组件
│   ├── HomeView.vue    # 游戏选择页面
│   ├── GameView.vue    # 游戏页面
│   └── GameCard.vue    # 游戏卡片组件
├── games/              # 游戏逻辑
│   ├── tetris/         # 俄罗斯方块
│   └── snake/          # 贪吃蛇
├── stores/             # Pinia 状态管理
├── composables/        # Vue 组合式函数
├── engine/             # PixiJS 引擎封装
├── router/             # Vue Router 配置
├── types/              # TypeScript 类型定义
└── main.ts             # 应用入口
```

## 开源协议

本项目基于 [MIT 开源协议](LICENSE) 发布。
