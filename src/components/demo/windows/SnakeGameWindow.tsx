
import React, { useState, useEffect, useCallback } from 'react';
import { Window } from '../Window';
import { Play, Pause, RotateCcw, Trophy } from 'lucide-react';

interface SnakeGameWindowProps {
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  zIndex: number;
  isMaximized?: boolean;
}

interface Position {
  x: number;
  y: number;
}

export const SnakeGameWindow = ({ onClose, onMinimize, onMaximize, zIndex, isMaximized }: SnakeGameWindowProps) => {
  const GRID_SIZE = 20;
  const CANVAS_SIZE = 400;
  
  const [snake, setSnake] = useState<Position[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Position>({ x: 15, y: 15 });
  const [direction, setDirection] = useState<Position>({ x: 0, y: -1 });
  const [gameRunning, setGameRunning] = useState(false);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const generateFood = useCallback(() => {
    const newFood = {
      x: Math.floor(Math.random() * (CANVAS_SIZE / GRID_SIZE)),
      y: Math.floor(Math.random() * (CANVAS_SIZE / GRID_SIZE))
    };
    setFood(newFood);
  }, []);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setDirection({ x: 0, y: -1 });
    setScore(0);
    setGameOver(false);
    generateFood();
  };

  const moveSnake = useCallback(() => {
    if (!gameRunning || gameOver) return;

    setSnake(currentSnake => {
      const newSnake = [...currentSnake];
      const head = { ...newSnake[0] };
      
      head.x += direction.x;
      head.y += direction.y;

      // Check wall collision
      if (head.x < 0 || head.x >= CANVAS_SIZE / GRID_SIZE || 
          head.y < 0 || head.y >= CANVAS_SIZE / GRID_SIZE) {
        setGameOver(true);
        setGameRunning(false);
        return currentSnake;
      }

      // Check self collision
      if (newSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
        setGameOver(true);
        setGameRunning(false);
        return currentSnake;
      }

      newSnake.unshift(head);

      // Check food collision
      if (head.x === food.x && head.y === food.y) {
        setScore(prev => prev + 10);
        generateFood();
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, gameRunning, gameOver, generateFood]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!gameRunning) return;
      
      switch (e.key) {
        case 'ArrowUp':
          if (direction.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (direction.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (direction.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (direction.x === 0) setDirection({ x: 1, y: 0 });
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [direction, gameRunning]);

  useEffect(() => {
    const gameInterval = setInterval(moveSnake, 150);
    return () => clearInterval(gameInterval);
  }, [moveSnake]);

  return (
    <Window
      title="Snake Game"
      onClose={onClose}
      onMinimize={onMinimize}
      onMaximize={onMaximize}
      zIndex={zIndex}
      initialSize={{ width: 500, height: 600 }}
      isMaximized={isMaximized}
    >
      <div className="p-4 bg-gray-900 text-white h-full flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Trophy className="w-4 h-4 text-yellow-400" />
              <span>Score: {score}</span>
            </div>
            <button
              onClick={() => setGameRunning(!gameRunning)}
              className="flex items-center space-x-1 px-3 py-1 bg-green-600 rounded hover:bg-green-700"
            >
              {gameRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{gameRunning ? 'Pause' : 'Play'}</span>
            </button>
            <button
              onClick={resetGame}
              className="flex items-center space-x-1 px-3 py-1 bg-blue-600 rounded hover:bg-blue-700"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        <div className="flex-1 flex justify-center items-center">
          <div className="relative">
            <svg width={CANVAS_SIZE} height={CANVAS_SIZE} className="border border-gray-600 bg-gray-800">
              {/* Grid */}
              {Array.from({ length: CANVAS_SIZE / GRID_SIZE }).map((_, i) => (
                <g key={i}>
                  <line x1={i * GRID_SIZE} y1="0" x2={i * GRID_SIZE} y2={CANVAS_SIZE} stroke="#374151" strokeWidth="0.5" />
                  <line x1="0" y1={i * GRID_SIZE} x2={CANVAS_SIZE} y2={i * GRID_SIZE} stroke="#374151" strokeWidth="0.5" />
                </g>
              ))}
              
              {/* Snake */}
              {snake.map((segment, index) => (
                <rect
                  key={index}
                  x={segment.x * GRID_SIZE}
                  y={segment.y * GRID_SIZE}
                  width={GRID_SIZE}
                  height={GRID_SIZE}
                  fill={index === 0 ? "#10B981" : "#059669"}
                  stroke="#065F46"
                />
              ))}
              
              {/* Food */}
              <circle
                cx={food.x * GRID_SIZE + GRID_SIZE / 2}
                cy={food.y * GRID_SIZE + GRID_SIZE / 2}
                r={GRID_SIZE / 2 - 1}
                fill="#EF4444"
              />
            </svg>
            
            {gameOver && (
              <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-red-400 mb-2">Game Over!</h2>
                  <p className="text-gray-300 mb-4">Final Score: {score}</p>
                  <button
                    onClick={resetGame}
                    className="px-4 py-2 bg-green-600 rounded hover:bg-green-700"
                  >
                    Play Again
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="text-center text-sm text-gray-400 mt-4">
          Use arrow keys to control the snake
        </div>
      </div>
    </Window>
  );
};
