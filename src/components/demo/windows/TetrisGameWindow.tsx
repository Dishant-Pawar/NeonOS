
import React, { useState, useEffect, useCallback } from 'react';
import { Window } from '../Window';
import { Play, Pause, RotateCcw, Trophy, ArrowDown } from 'lucide-react';

interface TetrisGameWindowProps {
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  zIndex: number;
  isMaximized?: boolean;
}

const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;
const CELL_SIZE = 20;

const TETROMINOES = {
  I: { shape: [[1, 1, 1, 1]], color: '#00FFFF' },
  O: { shape: [[1, 1], [1, 1]], color: '#FFFF00' },
  T: { shape: [[0, 1, 0], [1, 1, 1]], color: '#800080' },
  S: { shape: [[0, 1, 1], [1, 1, 0]], color: '#00FF00' },
  Z: { shape: [[1, 1, 0], [0, 1, 1]], color: '#FF0000' },
  J: { shape: [[1, 0, 0], [1, 1, 1]], color: '#0000FF' },
  L: { shape: [[0, 0, 1], [1, 1, 1]], color: '#FFA500' }
};

type TetrominoType = keyof typeof TETROMINOES;

interface Piece {
  shape: number[][];
  x: number;
  y: number;
  color: string;
}

export const TetrisGameWindow = ({ onClose, onMinimize, onMaximize, zIndex, isMaximized }: TetrisGameWindowProps) => {
  const [board, setBoard] = useState<string[][]>(() => 
    Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(''))
  );
  const [currentPiece, setCurrentPiece] = useState<Piece | null>(null);
  const [gameRunning, setGameRunning] = useState(false);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [linesCleared, setLinesCleared] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const getRandomPiece = (): Piece => {
    const types: TetrominoType[] = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];
    const type = types[Math.floor(Math.random() * types.length)];
    const tetromino = TETROMINOES[type];
    
    return {
      shape: tetromino.shape,
      x: Math.floor(BOARD_WIDTH / 2) - Math.floor(tetromino.shape[0].length / 2),
      y: 0,
      color: tetromino.color
    };
  };

  const isValidPosition = (piece: Piece, board: string[][], offsetX = 0, offsetY = 0): boolean => {
    for (let y = 0; y < piece.shape.length; y++) {
      for (let x = 0; x < piece.shape[y].length; x++) {
        if (piece.shape[y][x]) {
          const newX = piece.x + x + offsetX;
          const newY = piece.y + y + offsetY;
          
          if (newX < 0 || newX >= BOARD_WIDTH || newY >= BOARD_HEIGHT) {
            return false;
          }
          
          if (newY >= 0 && board[newY][newX]) {
            return false;
          }
        }
      }
    }
    return true;
  };

  const rotatePiece = (piece: Piece): Piece => {
    const rotated = piece.shape[0].map((_, index) =>
      piece.shape.map(row => row[index]).reverse()
    );
    return { ...piece, shape: rotated };
  };

  const clearLines = (board: string[][]): { newBoard: string[][]; linesCleared: number } => {
    const newBoard = board.filter(row => !row.every(cell => cell !== ''));
    const clearedLines = BOARD_HEIGHT - newBoard.length;
    
    while (newBoard.length < BOARD_HEIGHT) {
      newBoard.unshift(Array(BOARD_WIDTH).fill(''));
    }
    
    return { newBoard, linesCleared: clearedLines };
  };

  const placePiece = useCallback(() => {
    if (!currentPiece) return;

    const newBoard = board.map(row => [...row]);
    
    for (let y = 0; y < currentPiece.shape.length; y++) {
      for (let x = 0; x < currentPiece.shape[y].length; x++) {
        if (currentPiece.shape[y][x]) {
          const boardY = currentPiece.y + y;
          const boardX = currentPiece.x + x;
          if (boardY >= 0) {
            newBoard[boardY][boardX] = currentPiece.color;
          }
        }
      }
    }

    const { newBoard: clearedBoard, linesCleared: cleared } = clearLines(newBoard);
    setBoard(clearedBoard);
    setLinesCleared(prev => prev + cleared);
    setScore(prev => prev + cleared * 100 * level);
    setLevel(Math.floor(linesCleared / 10) + 1);

    // Check game over
    if (currentPiece.y <= 0) {
      setGameOver(true);
      setGameRunning(false);
    }

    setCurrentPiece(getRandomPiece());
  }, [currentPiece, board, level, linesCleared]);

  const movePiece = useCallback((direction: 'left' | 'right' | 'down') => {
    if (!currentPiece || !gameRunning) return;

    const offsets = {
      left: { x: -1, y: 0 },
      right: { x: 1, y: 0 },
      down: { x: 0, y: 1 }
    };

    const offset = offsets[direction];
    
    if (isValidPosition(currentPiece, board, offset.x, offset.y)) {
      setCurrentPiece(prev => prev ? {
        ...prev,
        x: prev.x + offset.x,
        y: prev.y + offset.y
      } : null);
    } else if (direction === 'down') {
      placePiece();
    }
  }, [currentPiece, board, gameRunning, placePiece]);

  const handleRotate = () => {
    if (!currentPiece || !gameRunning) return;
    
    const rotated = rotatePiece(currentPiece);
    if (isValidPosition(rotated, board)) {
      setCurrentPiece(rotated);
    }
  };

  const resetGame = () => {
    setBoard(Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill('')));
    setCurrentPiece(getRandomPiece());
    setScore(0);
    setLevel(1);
    setLinesCleared(0);
    setGameOver(false);
  };

  useEffect(() => {
    if (!currentPiece && gameRunning && !gameOver) {
      setCurrentPiece(getRandomPiece());
    }
  }, [currentPiece, gameRunning, gameOver]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!gameRunning) return;
      
      switch (e.key) {
        case 'ArrowLeft':
          movePiece('left');
          break;
        case 'ArrowRight':
          movePiece('right');
          break;
        case 'ArrowDown':
          movePiece('down');
          break;
        case 'ArrowUp':
        case ' ':
          handleRotate();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [movePiece, gameRunning]);

  useEffect(() => {
    const dropInterval = setInterval(() => {
      if (gameRunning) {
        movePiece('down');
      }
    }, Math.max(100, 1000 - (level - 1) * 100));

    return () => clearInterval(dropInterval);
  }, [movePiece, gameRunning, level]);

  const renderBoard = () => {
    const displayBoard = board.map(row => [...row]);
    
    // Add current piece to display
    if (currentPiece) {
      for (let y = 0; y < currentPiece.shape.length; y++) {
        for (let x = 0; x < currentPiece.shape[y].length; x++) {
          if (currentPiece.shape[y][x]) {
            const boardY = currentPiece.y + y;
            const boardX = currentPiece.x + x;
            if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
              displayBoard[boardY][boardX] = currentPiece.color;
            }
          }
        }
      }
    }

    return displayBoard.map((row, y) => (
      <div key={y} className="flex">
        {row.map((cell, x) => (
          <div
            key={x}
            className="border border-gray-600"
            style={{
              width: CELL_SIZE,
              height: CELL_SIZE,
              backgroundColor: cell || '#1F2937'
            }}
          />
        ))}
      </div>
    ));
  };

  return (
    <Window
      title="Tetris"
      onClose={onClose}
      onMinimize={onMinimize}
      onMaximize={onMaximize}
      zIndex={zIndex}
      initialSize={{ width: 400, height: 600 }}
      isMaximized={isMaximized}
    >
      <div className="p-4 bg-gray-900 text-white h-full flex">
        <div className="flex-1">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Trophy className="w-4 h-4 text-yellow-400" />
                <span>Score: {score}</span>
              </div>
              <div>Level: {level}</div>
              <div>Lines: {linesCleared}</div>
            </div>
          </div>

          <div className="flex space-x-4">
            <div className="bg-gray-800 p-2 rounded">
              {renderBoard()}
            </div>

            <div className="flex flex-col space-y-2">
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

              <div className="text-xs text-gray-400 mt-4">
                <div>← → Move</div>
                <div>↓ Drop</div>
                <div>↑/Space Rotate</div>
              </div>
            </div>
          </div>

          {gameOver && (
            <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
              <div className="bg-white text-gray-800 p-6 rounded-lg text-center">
                <h2 className="text-2xl font-bold text-red-600 mb-2">Game Over!</h2>
                <p className="mb-2">Final Score: {score}</p>
                <p className="mb-4">Level: {level}</p>
                <button
                  onClick={resetGame}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Play Again
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Window>
  );
};
