
import React, { useState } from 'react';
import { X, Minimize, Maximize, Minimize2 } from 'lucide-react';

interface WindowProps {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  zIndex: number;
  initialSize?: { width: number; height: number };
  initialPosition?: { x: number; y: number };
  isMaximized?: boolean;
}

export const Window = ({ 
  title, 
  children, 
  onClose, 
  onMinimize, 
  onMaximize, 
  zIndex,
  initialSize = { width: 800, height: 600 },
  initialPosition = { x: 200, y: 100 },
  isMaximized = false
}: WindowProps) => {
  const [position, setPosition] = useState(initialPosition);
  const [size, setSize] = useState(initialSize);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isMaximized) return; // Don't allow dragging when maximized
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && !isMaximized) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Calculate window style based on maximized state
  const windowStyle = isMaximized ? {
    left: 0,
    top: 32, // Start below the top bar (32px height)
    width: '100vw',
    height: 'calc(100vh - 80px)', // Account for top bar (32px) and taskbar (48px)
    zIndex
  } : {
    left: position.x,
    top: position.y,
    width: size.width,
    height: size.height,
    zIndex
  };

  return (
    <div
      className={`absolute bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden animate-scale-in transition-all duration-300 ${
        isMaximized ? 'rounded-none' : ''
      }`}
      style={windowStyle}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Title Bar */}
      <div
        className="h-8 bg-gray-100 border-b border-gray-200 flex items-center justify-between px-3 cursor-move select-none"
        onMouseDown={handleMouseDown}
        onDoubleClick={onMaximize}
      >
        <span className="text-sm font-medium text-gray-700">{title}</span>
        <div className="flex items-center space-x-1">
          <button
            onClick={onMinimize}
            className="w-5 h-5 rounded-full bg-yellow-400 hover:bg-yellow-500 flex items-center justify-center"
          >
            <Minimize className="w-3 h-3 text-yellow-800" />
          </button>
          <button
            onClick={onMaximize}
            className="w-5 h-5 rounded-full bg-green-400 hover:bg-green-500 flex items-center justify-center"
          >
            {isMaximized ? (
              <Minimize2 className="w-3 h-3 text-green-800" />
            ) : (
              <Maximize className="w-3 h-3 text-green-800" />
            )}
          </button>
          <button
            onClick={onClose}
            className="w-5 h-5 rounded-full bg-red-400 hover:bg-red-500 flex items-center justify-center"
          >
            <X className="w-3 h-3 text-red-800" />
          </button>
        </div>
      </div>

      {/* Window Content */}
      <div className="h-full overflow-hidden">
        {children}
      </div>
    </div>
  );
};
