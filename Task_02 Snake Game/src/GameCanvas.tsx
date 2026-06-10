import { useEffect, useRef, useState, useCallback } from 'react';
import { Point, Direction, MapTheme, Difficulty } from './config';
import { GRID_WIDTH, GRID_HEIGHT, CELL_SIZE, THEMES, MAPS } from './config';
import { audio } from './audio';

interface GameCanvasProps {
  skin: string;
  mapTheme: MapTheme;
  difficulty: Difficulty;
  onGameOver: (score: number) => void;
}

export default function GameCanvas({ skin, mapTheme, difficulty, onGameOver }: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const scoreRef = useRef(0);

  const snake = useRef<Point[]>([{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }]);
  const dir = useRef<Direction>({ x: 1, y: 0 });
  const nextDir = useRef<Direction>({ x: 1, y: 0 });
  const food = useRef<Point>({ x: 15, y: 10 });
  const isGameOver = useRef(false);

  const theme = THEMES[mapTheme];
  const obstacles = MAPS[mapTheme].obstacles;

  const spawnFood = useCallback(() => {
    while (true) {
      const x = Math.floor(Math.random() * GRID_WIDTH);
      const y = Math.floor(Math.random() * GRID_HEIGHT);
      
      const snakeHit = snake.current.some((s) => s.x === x && s.y === y);
      const obsHit = obstacles.some((o) => o.x === x && o.y === y);
      
      if (!snakeHit && !obsHit) return { x, y };
    }
  }, [obstacles]);

  useEffect(() => {
    food.current = spawnFood();
  }, [spawnFood]);

  useEffect(() => {
    let touchStartX = 0;
    let touchStartY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      audio.init();
      if (isGameOver.current) return;

      const touchEndX = e.changedTouches[0].screenX;
      const touchEndY = e.changedTouches[0].screenY;
      
      const dx = touchEndX - touchStartX;
      const dy = touchEndY - touchStartY;
      
      const absDx = Math.abs(dx);
      const absDy = Math.abs(dy);

      if (Math.max(absDx, absDy) > 30) {
        const currentDir = dir.current;
        if (absDx > absDy) {
          // Horizontal
          if (dx > 0 && currentDir.x !== -1) nextDir.current = { x: 1, y: 0 };
          else if (dx < 0 && currentDir.x !== 1) nextDir.current = { x: -1, y: 0 };
        } else {
          // Vertical
          if (dy > 0 && currentDir.y !== -1) nextDir.current = { x: 0, y: 1 };
          else if (dy < 0 && currentDir.y !== 1) nextDir.current = { x: 0, y: -1 };
        }
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Initialize audio context on first interaction if needed
      audio.init();

      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " ", "w", "a", "s", "d"].includes(e.key)) {
        e.preventDefault();
      }
      if (isGameOver.current) return;

      const currentDir = dir.current;
      switch (e.key.toLowerCase()) {
        case 'arrowup':
        case 'w':
          if (currentDir.y !== 1) nextDir.current = { x: 0, y: -1 };
          break;
        case 'arrowdown':
        case 's':
          if (currentDir.y !== -1) nextDir.current = { x: 0, y: 1 };
          break;
        case 'arrowleft':
        case 'a':
          if (currentDir.x !== 1) nextDir.current = { x: -1, y: 0 };
          break;
        case 'arrowright':
        case 'd':
          if (currentDir.x !== -1) nextDir.current = { x: 1, y: 0 };
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const update = () => {
      if (isGameOver.current) return;

      dir.current = nextDir.current;
      const head = { ...snake.current[0] };
      head.x += dir.current.x;
      head.y += dir.current.y;

      // Checking Collisions (Walls, Obstacles, Self)
      if (
        head.x < 0 || head.x >= GRID_WIDTH ||
        head.y < 0 || head.y >= GRID_HEIGHT ||
        obstacles.some((o) => o.x === head.x && o.y === head.y) ||
        snake.current.some((s) => s.x === head.x && s.y === head.y)
      ) {
        isGameOver.current = true;
        audio.playGameOver();
        onGameOver(scoreRef.current);
        return;
      }

      snake.current.unshift(head);

      // Check food consumption
      if (head.x === food.current.x && head.y === food.current.y) {
        const newScore = scoreRef.current + 10;
        scoreRef.current = newScore;
        setScore(newScore);
        audio.playEat();
        food.current = spawnFood();
      } else {
        snake.current.pop();
      }

      draw();
      
      // Speed increases dynamically as the score increases
      let baseSpeed = 150;
      if (difficulty === 'EASY') baseSpeed = 200;
      if (difficulty === 'HARD') baseSpeed = 100;

      const speed = Math.max(40, baseSpeed - Math.floor(scoreRef.current / 50) * 10);
      timeoutId = setTimeout(update, speed);
    };

    const draw = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Draw background
      ctx.fillStyle = theme.bg1;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw checkerboard grid
      ctx.fillStyle = theme.bg2;
      for (let row = 0; row < GRID_HEIGHT; row++) {
        for (let col = 0; col < GRID_WIDTH; col++) {
          if ((row + col) % 2 === 0) {
            ctx.fillRect(col * CELL_SIZE, row * CELL_SIZE, CELL_SIZE, CELL_SIZE);
          }
        }
      }

      // Draw obstacles
      ctx.fillStyle = theme.obstacle;
      ctx.strokeStyle = theme.border;
      ctx.lineWidth = 2;
      obstacles.forEach(o => {
        ctx.fillRect(o.x * CELL_SIZE, o.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        ctx.strokeRect(o.x * CELL_SIZE, o.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
      });

      // Draw food
      ctx.fillStyle = theme.food;
      ctx.beginPath();
      ctx.arc(
        food.current.x * CELL_SIZE + CELL_SIZE / 2,
        food.current.y * CELL_SIZE + CELL_SIZE / 2,
        CELL_SIZE / 2 - 2,
        0, 2 * Math.PI
      );
      ctx.fill();

      // Draw snake
      snake.current.forEach((segment, i) => {
        ctx.fillStyle = skin;
        ctx.fillRect(segment.x * CELL_SIZE, segment.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 1;
        ctx.strokeRect(segment.x * CELL_SIZE, segment.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);

        if (i === 0) {
          // Draw eyes on the head based on movement direction
          ctx.fillStyle = '#fff';
          const s = 3;
          let ex1 = 0, ey1 = 0, ex2 = 0, ey2 = 0;
          const { x, y } = dir.current;

          if (x === 1) { // right
            ex1 = CELL_SIZE - 6; ey1 = 4;
            ex2 = CELL_SIZE - 6; ey2 = CELL_SIZE - 7;
          } else if (x === -1) { // left
            ex1 = 3; ey1 = 4;
            ex2 = 3; ey2 = CELL_SIZE - 7;
          } else if (y === -1) { // up
            ex1 = 4; ey1 = 3;
            ex2 = CELL_SIZE - 7; ey2 = 3;
          } else { // down / Default starting facing right but moving 1,0 so x===1
            ex1 = 4; ey1 = CELL_SIZE - 6;
            ex2 = CELL_SIZE - 7; ey2 = CELL_SIZE - 6;
          }
          ctx.fillRect(segment.x * CELL_SIZE + ex1, segment.y * CELL_SIZE + ey1, s, s);
          ctx.fillRect(segment.x * CELL_SIZE + ex2, segment.y * CELL_SIZE + ey2, s, s);
        }
      });
    };

    update(); // Initiate Game Loop
    return () => clearTimeout(timeoutId);
  }, [theme, obstacles, skin, difficulty, spawnFood, onGameOver]);

  return (
    <div className="flex flex-col items-center w-full max-w-[600px] mx-auto animate-fade-in">
      <div className="flex justify-between w-full mb-4 px-2" style={{ color: theme.border }}>
        <span className="text-sm md:text-base">SCORE: {score}</span>
        <span className="text-sm md:text-base">DIFF: {difficulty}</span>
        <span className="text-sm md:text-base">MAP: {mapTheme}</span>
      </div>
      <div
        className="border-4 shadow-lg w-full max-w-[500px] touch-none"
        style={{ borderColor: theme.border, boxShadow: `0 0 30px ${theme.border}40` }}
      >
        <canvas
          ref={canvasRef}
          width={GRID_WIDTH * CELL_SIZE}
          height={GRID_HEIGHT * CELL_SIZE}
          className="w-full h-auto bg-black block"
          style={{ imageRendering: 'pixelated' }}
        />
      </div>
      <div className="mt-8 text-xs text-gray-400 text-center opacity-70 animate-pulse">
        Use WASD, Arrow Keys, or Swipe to move
      </div>
    </div>
  );
}
