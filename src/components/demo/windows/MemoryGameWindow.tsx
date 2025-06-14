
import React, { useState, useEffect } from 'react';
import { Window } from '../Window';
import { RotateCcw, Trophy, Clock } from 'lucide-react';

interface MemoryGameWindowProps {
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  zIndex: number;
  isMaximized?: boolean;
}

interface Card {
  id: number;
  value: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export const MemoryGameWindow = ({ onClose, onMinimize, onMaximize, zIndex, isMaximized }: MemoryGameWindowProps) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);

  const cardEmojis = ['🎮', '🚀', '⭐', '🎯', '🎲', '🎪', '🎨', '🎭'];

  const initializeGame = () => {
    const gameCards = [...cardEmojis, ...cardEmojis]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({
        id: index,
        value: emoji,
        isFlipped: false,
        isMatched: false
      }));
    
    setCards(gameCards);
    setFlippedCards([]);
    setMoves(0);
    setMatches(0);
    setGameWon(false);
    setGameStarted(false);
    setTimeElapsed(0);
  };

  useEffect(() => {
    initializeGame();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameStarted && !gameWon) {
      interval = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameStarted, gameWon]);

  const handleCardClick = (cardId: number) => {
    if (!gameStarted) setGameStarted(true);
    
    const card = cards.find(c => c.id === cardId);
    if (!card || card.isFlipped || card.isMatched || flippedCards.length >= 2) return;

    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);

    setCards(prev => prev.map(c => 
      c.id === cardId ? { ...c, isFlipped: true } : c
    ));

    if (newFlippedCards.length === 2) {
      setMoves(prev => prev + 1);
      
      const [firstId, secondId] = newFlippedCards;
      const firstCard = cards.find(c => c.id === firstId);
      const secondCard = cards.find(c => c.id === secondId);

      if (firstCard?.value === secondCard?.value) {
        // Match found
        setTimeout(() => {
          setCards(prev => prev.map(c => 
            (c.id === firstId || c.id === secondId) 
              ? { ...c, isMatched: true }
              : c
          ));
          setMatches(prev => {
            const newMatches = prev + 1;
            if (newMatches === cardEmojis.length) {
              setGameWon(true);
            }
            return newMatches;
          });
          setFlippedCards([]);
        }, 500);
      } else {
        // No match
        setTimeout(() => {
          setCards(prev => prev.map(c => 
            (c.id === firstId || c.id === secondId) 
              ? { ...c, isFlipped: false }
              : c
          ));
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Window
      title="Memory Match"
      onClose={onClose}
      onMinimize={onMinimize}
      onMaximize={onMaximize}
      zIndex={zIndex}
      initialSize={{ width: 500, height: 600 }}
      isMaximized={isMaximized}
    >
      <div className="p-4 bg-gradient-to-br from-purple-900 to-blue-900 text-white h-full">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Trophy className="w-4 h-4 text-yellow-400" />
              <span>Moves: {moves}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4 text-blue-400" />
              <span>Time: {formatTime(timeElapsed)}</span>
            </div>
            <div>Matches: {matches}/{cardEmojis.length}</div>
          </div>
          <button
            onClick={initializeGame}
            className="flex items-center space-x-1 px-3 py-1 bg-green-600 rounded hover:bg-green-700"
          >
            <RotateCcw className="w-4 h-4" />
            <span>New Game</span>
          </button>
        </div>

        <div className="grid grid-cols-4 gap-3 max-w-md mx-auto">
          {cards.map((card) => (
            <div
              key={card.id}
              onClick={() => handleCardClick(card.id)}
              className={`
                w-20 h-20 rounded-lg cursor-pointer transition-all duration-300 flex items-center justify-center text-2xl
                ${card.isFlipped || card.isMatched 
                  ? 'bg-white text-gray-800 transform rotate-0' 
                  : 'bg-gradient-to-br from-blue-500 to-purple-600 hover:from-blue-400 hover:to-purple-500 transform hover:scale-105'
                }
                ${card.isMatched ? 'ring-2 ring-green-400' : ''}
              `}
            >
              {card.isFlipped || card.isMatched ? card.value : '?'}
            </div>
          ))}
        </div>

        {gameWon && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-white text-gray-800 p-6 rounded-lg text-center">
              <h2 className="text-2xl font-bold text-green-600 mb-2">🎉 Congratulations!</h2>
              <p className="mb-2">You completed the game!</p>
              <p className="mb-2">Moves: {moves}</p>
              <p className="mb-4">Time: {formatTime(timeElapsed)}</p>
              <button
                onClick={initializeGame}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Play Again
              </button>
            </div>
          </div>
        )}

        <div className="text-center text-sm text-gray-300 mt-6">
          Click cards to flip them and find matching pairs!
        </div>
      </div>
    </Window>
  );
};
