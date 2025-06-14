import React, { useState } from 'react';
import { Folder, Terminal, AppWindow, Wifi, Shield, Camera, Activity, Settings, Gamepad2, Zap, Puzzle, Music } from 'lucide-react';
import { useDemoContext } from './DemoContext';
import { WindowManager } from './WindowManager';
import { Taskbar } from './Taskbar';
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuSeparator, ContextMenuSub, ContextMenuSubContent, ContextMenuSubTrigger, ContextMenuTrigger } from '../ui/context-menu';
import { RefreshCw, Clipboard, SortAsc, Eye } from 'lucide-react';

interface DesktopIcon {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  position: { x: number; y: number };
  color: string;
}

export const Desktop = () => {
  const { openWindows, setOpenWindows } = useDemoContext();
  const [draggedIcon, setDraggedIcon] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  
  const [desktopIcons, setDesktopIcons] = useState<DesktopIcon[]>([
    {
      id: 'file-manager',
      name: 'File Manager',
      icon: Folder,
      position: { x: 50, y: 100 },
      color: 'bg-blue-500'
    },
    {
      id: 'terminal',
      name: 'Terminal',
      icon: Terminal,
      position: { x: 50, y: 200 },
      color: 'bg-gray-800'
    },
    {
      id: 'app-drawer',
      name: 'Applications',
      icon: AppWindow,
      position: { x: 50, y: 300 },
      color: 'bg-purple-500'
    },
    {
      id: 'wifi-finder',
      name: 'WiFi Scanner',
      icon: Wifi,
      position: { x: 50, y: 400 },
      color: 'bg-green-500'
    },
    {
      id: 'antivirus',
      name: 'RO360 Antivirus',
      icon: Shield,
      position: { x: 50, y: 500 },
      color: 'bg-red-500'
    },
    {
      id: 'camera',
      name: 'RAVAN Camera',
      icon: Camera,
      position: { x: 50, y: 600 },
      color: 'bg-pink-500'
    },
    {
      id: 'task-manager',
      name: 'Task Manager',
      icon: Activity,
      position: { x: 150, y: 100 },
      color: 'bg-orange-500'
    },
    {
      id: 'system-settings',
      name: 'System Settings',
      icon: Settings,
      position: { x: 150, y: 200 },
      color: 'bg-slate-600'
    },
    {
      id: 'music-player',
      name: 'Music Player',
      icon: Music,
      position: { x: 150, y: 300 },
      color: 'bg-indigo-500'
    },
    {
      id: 'snake-game',
      name: 'Snake Game',
      icon: Gamepad2,
      position: { x: 150, y: 400 },
      color: 'bg-emerald-500'
    },
    {
      id: 'memory-game',
      name: 'Memory Match',
      icon: Puzzle,
      position: { x: 150, y: 500 },
      color: 'bg-cyan-500'
    },
    {
      id: 'tetris-game',
      name: 'Tetris',
      icon: Zap,
      position: { x: 150, y: 600 },
      color: 'bg-yellow-500'
    }
  ]);

  const handleIconDoubleClick = (iconId: string) => {
    if (!openWindows.includes(iconId)) {
      setOpenWindows([...openWindows, iconId]);
    }
  };

  const handleIconClick = (iconId: string) => {
    console.log(`Selected ${iconId}`);
  };

  const handleMouseDown = (e: React.MouseEvent, iconId: string) => {
    const icon = desktopIcons.find(i => i.id === iconId);
    if (icon) {
      setDraggedIcon(iconId);
      setDragOffset({
        x: e.clientX - icon.position.x,
        y: e.clientY - icon.position.y
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (draggedIcon) {
      const newPosition = {
        x: Math.max(0, Math.min(e.clientX - dragOffset.x, window.innerWidth - 80)),
        y: Math.max(80, Math.min(e.clientY - dragOffset.y, window.innerHeight - 150))
      };

      setDesktopIcons(icons => 
        icons.map(icon => 
          icon.id === draggedIcon 
            ? { ...icon, position: newPosition }
            : icon
        )
      );
    }
  };

  const handleMouseUp = () => {
    setDraggedIcon(null);
    setDragOffset({ x: 0, y: 0 });
  };

  const handleRefresh = () => {
    console.log('Desktop refreshed');
    // Force a re-render or refresh logic here
  };

  const handlePaste = () => {
    console.log('Paste action');
    // Paste logic here
  };

  const handleSortBy = (sortType: string) => {
    console.log(`Sort by ${sortType}`);
    // Sort logic here
  };

  const handleViewChange = (viewType: string) => {
    console.log(`View changed to ${viewType}`);
    // View change logic here
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div 
          className="absolute inset-0 pt-8 pb-12"
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* Desktop Icons */}
          {desktopIcons.map((icon) => (
            <div
              key={icon.id}
              className="absolute flex flex-col items-center cursor-pointer group select-none"
              style={{ left: icon.position.x, top: icon.position.y }}
              onClick={() => handleIconClick(icon.id)}
              onDoubleClick={() => handleIconDoubleClick(icon.id)}
              onMouseDown={(e) => handleMouseDown(e, icon.id)}
            >
              <div className={`w-16 h-16 ${icon.color} rounded-lg flex items-center justify-center group-hover:scale-105 transition-all duration-200 shadow-lg`}>
                <icon.icon className="w-8 h-8 text-white" />
              </div>
              <span className="text-white text-xs mt-2 bg-black/30 px-2 py-1 rounded backdrop-blur-sm">
                {icon.name}
              </span>
            </div>
          ))}

          {/* Window Manager */}
          <WindowManager />

          {/* Taskbar */}
          <Taskbar />
        </div>
      </ContextMenuTrigger>
      
      <ContextMenuContent className="w-48">
        <ContextMenuSub>
          <ContextMenuSubTrigger>
            <SortAsc className="w-4 h-4 mr-2" />
            Sort by
          </ContextMenuSubTrigger>
          <ContextMenuSubContent>
            <ContextMenuItem onClick={() => handleSortBy('name')}>
              Name
            </ContextMenuItem>
            <ContextMenuItem onClick={() => handleSortBy('size')}>
              Size
            </ContextMenuItem>
            <ContextMenuItem onClick={() => handleSortBy('date')}>
              Date modified
            </ContextMenuItem>
            <ContextMenuItem onClick={() => handleSortBy('type')}>
              Type
            </ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>
        
        <ContextMenuSeparator />
        
        <ContextMenuItem onClick={handlePaste}>
          <Clipboard className="w-4 h-4 mr-2" />
          Paste
        </ContextMenuItem>
        
        <ContextMenuSeparator />
        
        <ContextMenuItem onClick={handleRefresh}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </ContextMenuItem>
        
        <ContextMenuSeparator />
        
        <ContextMenuSub>
          <ContextMenuSubTrigger>
            <Eye className="w-4 h-4 mr-2" />
            View
          </ContextMenuSubTrigger>
          <ContextMenuSubContent>
            <ContextMenuItem onClick={() => handleViewChange('large-icons')}>
              Large icons
            </ContextMenuItem>
            <ContextMenuItem onClick={() => handleViewChange('medium-icons')}>
              Medium icons
            </ContextMenuItem>
            <ContextMenuItem onClick={() => handleViewChange('small-icons')}>
              Small icons
            </ContextMenuItem>
            <ContextMenuItem onClick={() => handleViewChange('list')}>
              List
            </ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>
      </ContextMenuContent>
    </ContextMenu>
  );
};
