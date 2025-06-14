
import React, { useState } from 'react';
import { Window } from '../Window';

interface CalculatorWindowProps {
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  zIndex: number;
}

export const CalculatorWindow = ({ onClose, onMinimize, onMaximize, zIndex }: CalculatorWindowProps) => {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForValue, setWaitingForValue] = useState(false);

  const inputNumber = (num: string) => {
    if (waitingForValue) {
      setDisplay(num);
      setWaitingForValue(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  };

  const inputOperator = (nextOperator: string) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue || 0;
      const newValue = calculate(currentValue, inputValue, operation);

      setDisplay(String(newValue));
      setPreviousValue(newValue);
    }

    setWaitingForValue(true);
    setOperation(nextOperator);
  };

  const calculate = (firstValue: number, secondValue: number, operation: string): number => {
    switch (operation) {
      case '+':
        return firstValue + secondValue;
      case '-':
        return firstValue - secondValue;
      case '×':
        return firstValue * secondValue;
      case '÷':
        return firstValue / secondValue;
      default:
        return secondValue;
    }
  };

  const performCalculation = () => {
    const inputValue = parseFloat(display);

    if (previousValue !== null && operation) {
      const newValue = calculate(previousValue, inputValue, operation);
      setDisplay(String(newValue));
      setPreviousValue(null);
      setOperation(null);
      setWaitingForValue(true);
    }
  };

  const clear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForValue(false);
  };

  const Button = ({ onClick, className = '', children }: { onClick: () => void; className?: string; children: React.ReactNode }) => (
    <button
      onClick={onClick}
      className={`h-16 text-lg font-semibold border border-gray-300 hover:bg-gray-100 active:bg-gray-200 transition-colors ${className}`}
    >
      {children}
    </button>
  );

  return (
    <Window
      title="Calculator"
      onClose={onClose}
      onMinimize={onMinimize}
      onMaximize={onMaximize}
      zIndex={zIndex}
      initialSize={{ width: 300, height: 400 }}
    >
      <div className="bg-gray-50 h-full flex flex-col">
        {/* Display */}
        <div className="bg-black text-white text-right text-2xl p-4 font-mono">
          {display}
        </div>

        {/* Buttons */}
        <div className="flex-1 grid grid-cols-4 gap-0">
          <Button onClick={clear} className="bg-red-500 text-white hover:bg-red-600">
            C
          </Button>
          <Button onClick={() => inputOperator('÷')} className="bg-orange-500 text-white hover:bg-orange-600">
            ÷
          </Button>
          <Button onClick={() => inputOperator('×')} className="bg-orange-500 text-white hover:bg-orange-600">
            ×
          </Button>
          <Button onClick={() => setDisplay(display.slice(0, -1) || '0')} className="bg-gray-400 text-white hover:bg-gray-500">
            ⌫
          </Button>

          <Button onClick={() => inputNumber('7')}>7</Button>
          <Button onClick={() => inputNumber('8')}>8</Button>
          <Button onClick={() => inputNumber('9')}>9</Button>
          <Button onClick={() => inputOperator('-')} className="bg-orange-500 text-white hover:bg-orange-600">
            -
          </Button>

          <Button onClick={() => inputNumber('4')}>4</Button>
          <Button onClick={() => inputNumber('5')}>5</Button>
          <Button onClick={() => inputNumber('6')}>6</Button>
          <Button onClick={() => inputOperator('+')} className="bg-orange-500 text-white hover:bg-orange-600">
            +
          </Button>

          <Button onClick={() => inputNumber('1')}>1</Button>
          <Button onClick={() => inputNumber('2')}>2</Button>
          <Button onClick={() => inputNumber('3')}>3</Button>
          <Button onClick={performCalculation} className="bg-blue-500 text-white hover:bg-blue-600 row-span-2">
            =
          </Button>

          <Button onClick={() => inputNumber('0')} className="col-span-2">
            0
          </Button>
          <Button onClick={() => inputNumber('.')}>.</Button>
        </div>
      </div>
    </Window>
  );
};
