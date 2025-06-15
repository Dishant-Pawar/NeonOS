
import React from 'react';
import { Power, RotateCcw, Moon, X } from 'lucide-react';
import { useDemoContext } from './DemoContext';

interface PowerMenuProps {
  onClose: () => void;
}

export const PowerMenu = ({ onClose }: PowerMenuProps) => {
  const { performRestart, performShutdown, performSleep } = useDemoContext();

  const handleRestart = () => {
    onClose();
    performRestart();
  };

  const handleShutdown = () => {
    onClose();
    performShutdown();
  };

  const handleSleep = () => {
    onClose();
    performSleep();
  };

  return (
    <div className="absolute top-8 right-4 w-64 bg-black/90 backdrop-blur-md rounded-lg shadow-xl border border-green-500/30 z-50">
      <div className="flex items-center justify-between p-4 border-b border-green-500/30">
        <h3 className="font-semibold text-green-400">Power Options</h3>
        <button
          onClick={onClose}
          className="p-1 hover:bg-green-500/20 rounded text-green-400"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      
      <div className="p-4 space-y-2">
        {/* Sleep Mode */}
        <button
          onClick={handleSleep}
          className="w-full flex items-center space-x-3 p-3 rounded-lg bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/20 transition-all duration-200"
        >
          <Moon className="w-5 h-5" />
          <div className="text-left">
            <div className="font-medium">Sleep</div>
            <div className="text-xs text-green-300/70">Put system to sleep</div>
          </div>
        </button>

        {/* Restart */}
        <button
          onClick={handleRestart}
          className="w-full flex items-center space-x-3 p-3 rounded-lg bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400 border border-yellow-500/20 transition-all duration-200"
        >
          <RotateCcw className="w-5 h-5" />
          <div className="text-left">
            <div className="font-medium">Restart</div>
            <div className="text-xs text-yellow-300/70">Restart RAVAN OS</div>
          </div>
        </button>

        {/* Shutdown */}
        <button
          onClick={handleShutdown}
          className="w-full flex items-center space-x-3 p-3 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-all duration-200"
        >
          <Power className="w-5 h-5" />
          <div className="text-left">
            <div className="font-medium">Shutdown</div>
            <div className="text-xs text-red-300/70">Turn off RAVAN OS</div>
          </div>
        </button>
      </div>
    </div>
  );
};
