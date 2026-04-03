# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A mini-game collection website "T Game" with Vue 3 + TypeScript + PixiJS + Pinia. Two games: Tetris and Snake.

## Commands

```bash
pnpm dev        # Start development server
pnpm build      # Type-check and build for production
pnpm preview    # Preview production build
```

## Tech Stack

- Vue 3.5.x with Composition API and `<script setup>`
- TypeScript 5.9.x
- Vite 8.x (uses Rolldown under the hood)
- pnpm (package manager)
- Pinia - state management
- PixiJS 8.x - 2D game rendering
- Vue Router 5.x

## Architecture

```
src/
├── types/game.ts           # Shared interfaces (IGame, GameType, GameState)
├── stores/
│   ├── gameStore.ts        # Game selection, active game state
│   └── scoreStore.ts       # Scores with localStorage persistence
├── composables/
│   ├── usePixiApp.ts       # PixiJS app lifecycle manager
│   └── useGameLoop.ts      # Game loop wrapper
├── engine/
│   └── PixiEngine.ts       # PixiJS app wrapper (init, resize, destroy)
├── games/
│   ├── Game.ts             # IGame interface
│   ├── tetris/
│   │   ├── tetrisConfig.ts  # Board size, colors, speeds
│   │   ├── TetrisPiece.ts   # Tetromino definitions & rotations
│   │   ├── TetrisBoard.ts   # Board state & collision detection
│   │   ├── TetrisGame.ts    # Main game logic
│   │   ├── TetrisRenderer.ts# PixiJS rendering
│   │   └── TetrisCanvas.vue # Vue wrapper
│   └── snake/
│       ├── snakeConfig.ts   # Grid size, colors, speeds
│       ├── SnakeBoard.ts    # Grid state & collision
│       ├── SnakeGame.ts     # Main game logic
│       ├── SnakeRenderer.ts # PixiJS rendering
│       └── SnakeCanvas.vue  # Vue wrapper
├── components/
│   ├── HomeView.vue         # Game selection page
│   ├── GameView.vue         # Game wrapper with scoreboard
│   └── GameCard.vue         # Individual game card
├── router/index.ts          # Routes: /, /play/:gameId
├── main.ts                  # App entry, Pinia + Router setup
└── App.vue                  # Root component with router-view
```

## Game Controls

**Tetris:** Arrow keys/WASD (move/rotate), Space (hard drop), P/Esc (pause)
**Snake:** Arrow keys/WASD (direction), P/Esc (pause)

## Key Interfaces

```typescript
interface IGame {
  readonly id: GameType
  init(canvas: HTMLCanvasElement): void
  start(): void
  pause(): void
  resume(): void
  stop(): void
  destroy(): void
}

type GameType = 'tetris' | 'snake'
type GameState = 'idle' | 'playing' | 'paused' | 'gameover'
```

## Critical Implementation Details

1. **PixiJS lifecycle**: Destroy game and engine on component unmount to prevent memory leaks
2. **High score persistence**: localStorage under `t-game-scores` key
3. **Responsive canvas**: Calculate size based on viewport while maintaining aspect ratio
