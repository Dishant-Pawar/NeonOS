
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
  const [isResizing, setIsResizing] = useState(false);
  const [resizeDirection, setResizeDirection] = useState<string>('');
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });

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

    if (isResizing && !isMaximized) {
      const deltaX = e.clientX - resizeStart.x;
      const deltaY = e.clientY - resizeStart.y;

      let newWidth = resizeStart.width;
      let newHeight = resizeStart.height;
      let newX = position.x;
      let newY = position.y;

      if (resizeDirection.includes('right')) {
        newWidth = Math.max(300, resizeStart.width + deltaX);
      }
      if (resizeDirection.includes('left')) {
        newWidth = Math.max(300, resizeStart.width - deltaX);
        newX = position.x + (resizeStart.width - newWidth);
      }
      if (resizeDirection.includes('bottom')) {
        newHeight = Math.max(200, resizeStart.height + deltaY);
      }
      if (resizeDirection.includes('top')) {
        newHeight = Math.max(200, resizeStart.height - deltaY);
        newY = position.y + (resizeStart.height - newHeight);
      }

      setSize({ width: newWidth, height: newHeight });
      setPosition({ x: newX, y: newY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
    setResizeDirection('');
  };

  const handleResizeStart = (e: React.MouseEvent, direction: string) => {
    if (isMaximized) return;
    e.stopPropagation();
    setIsResizing(true);
    setResizeDirection(direction);
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: size.width,
      height: size.height
    });
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
      <div className="h-full overflow-hidden relative">
        {children}
      </div>

      {/* Resize Handles */}
      {!isMaximized && (
        <>
          {/* Corner handles */}
          <div
            className="absolute top-0 left-0 w-3 h-3 cursor-nw-resize"
            onMouseDown={(e) => handleResizeStart(e, 'top-left')}
          />
          <div
            className="absolute top-0 right-0 w-3 h-3 cursor-ne-resize"
            onMouseDown={(e) => handleResizeStart(e, 'top-right')}
          />
          <div
            className="absolute bottom-0 left-0 w-3 h-3 cursor-sw-resize"
            onMouseDown={(e) => handleResizeStart(e, 'bottom-left')}
          />
          <div
            className="absolute bottom-0 right-0 w-3 h-3 cursor-se-resize bg-gray-300 hover:bg-gray-400 transition-colors"
            onMouseDown={(e) => handleResizeStart(e, 'bottom-right')}
          />

          {/* Edge handles */}
          <div
            className="absolute top-0 left-3 right-3 h-1 cursor-n-resize"
            onMouseDown={(e) => handleResizeStart(e, 'top')}
          />
          <div
            className="absolute bottom-0 left-3 right-3 h-1 cursor-s-resize"
            onMouseDown={(e) => handleResizeStart(e, 'bottom')}
          />
          <div
            className="absolute left-0 top-3 bottom-3 w-1 cursor-w-resize"
            onMouseDown={(e) => handleResizeStart(e, 'left')}
          />
          <div
            className="absolute right-0 top-3 bottom-3 w-1 cursor-e-resize"
            onMouseDown={(e) => handleResizeStart(e, 'right')}
          />
        </>
      )}
    </div>
  );
};
