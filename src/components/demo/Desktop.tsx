
import React, { useState } from 'react';
import { Folder, Terminal, AppWindow, Wifi, Shield, Camera, Activity, Settings, Gamepad2, Zap, Puzzle, Music } from 'lucide-react';
import { useDemoContext } from './DemoContext';
import { WindowManager } from './WindowManager';
import { Taskbar } from './Taskbar';
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuSeparator, ContextMenuSub, ContextMenuSubContent, ContextMenuSubTrigger, ContextMenuTrigger } from '../ui/context-menu';
import { RefreshCw, Clipboard, SortAsc, Eye, Plus, Minus } from 'lucide-react';

interface DesktopIcon {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  position: { x: number; y: number };
  color: string;
  size?: number;
  type: string;
  dateModified: Date;
  iconSize?: number; // Custom icon size for individual icons
}

type ViewMode = 'large-icons' | 'medium-icons' | 'small-icons' | 'list';
type SortBy = 'name' | 'size' | 'date' | 'type';

export const Desktop = () => {
  const { openWindows, setOpenWindows } = useDemoContext();
  const [draggedIcon, setDraggedIcon] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [viewMode, setViewMode] = useState<ViewMode>('large-icons');
  const [sortBy, setSortBy] = useState<SortBy>('name');
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);
  
  const [desktopIcons, setDesktopIcons] = useState<DesktopIcon[]>([
    {
      id: 'file-manager',
      name: 'File Manager',
      icon: Folder,
      position: { x: 50, y: 100 },
      color: 'bg-blue-500',
      size: 245,
      type: 'System',
      dateModified: new Date('2024-06-10'),
      iconSize: 64
    },
    {
      id: 'terminal',
      name: 'Terminal',
      icon: Terminal,
      position: { x: 50, y: 200 },
      color: 'bg-gray-800',
      size: 180,
      type: 'System',
      dateModified: new Date('2024-06-12'),
      iconSize: 64
    },
    {
      id: 'app-drawer',
      name: 'Applications',
      icon: AppWindow,
      position: { x: 50, y: 300 },
      color: 'bg-purple-500',
      size: 320,
      type: 'System',
      dateModified: new Date('2024-06-11'),
      iconSize: 64
    },
    {
      id: 'wifi-finder',
      name: 'WiFi Scanner',
      icon: Wifi,
      position: { x: 50, y: 400 },
      color: 'bg-green-500',
      size: 156,
      type: 'Network',
      dateModified: new Date('2024-06-09'),
      iconSize: 64
    },
    {
      id: 'antivirus',
      name: 'RO360 Antivirus',
      icon: Shield,
      position: { x: 50, y: 500 },
      color: 'bg-red-500',
      size: 512,
      type: 'Security',
      dateModified: new Date('2024-06-13'),
      iconSize: 64
    },
    {
      id: 'camera',
      name: 'RAVAN Camera',
      icon: Camera,
      position: { x: 50, y: 600 },
      color: 'bg-pink-500',
      size: 89,
      type: 'Media',
      dateModified: new Date('2024-06-08'),
      iconSize: 64
    },
    {
      id: 'task-manager',
      name: 'Task Manager',
      icon: Activity,
      position: { x: 150, y: 100 },
      color: 'bg-orange-500',
      size: 134,
      type: 'System',
      dateModified: new Date('2024-06-14'),
      iconSize: 64
    },
    {
      id: 'system-settings',
      name: 'System Settings',
      icon: Settings,
      position: { x: 150, y: 200 },
      color: 'bg-slate-600',
      size: 267,
      type: 'System',
      dateModified: new Date('2024-06-07'),
      iconSize: 64
    },
    {
      id: 'music-player',
      name: 'Music Player',
      icon: Music,
      position: { x: 150, y: 300 },
      color: 'bg-indigo-500',
      size: 45,
      type: 'Media',
      dateModified: new Date('2024-06-06'),
      iconSize: 64
    },
    {
      id: 'snake-game',
      name: 'Snake Game',
      icon: Gamepad2,
      position: { x: 150, y: 400 },
      color: 'bg-emerald-500',
      size: 78,
      type: 'Games',
      dateModified: new Date('2024-06-05'),
      iconSize: 64
    },
    {
      id: 'memory-game',
      name: 'Memory Match',
      icon: Puzzle,
      position: { x: 150, y: 500 },
      color: 'bg-cyan-500',
      size: 92,
      type: 'Games',
      dateModified: new Date('2024-06-04'),
      iconSize: 64
    },
    {
      id: 'tetris-game',
      name: 'Tetris',
      icon: Zap,
      position: { x: 150, y: 600 },
      color: 'bg-yellow-500',
      size: 63,
      type: 'Games',
      dateModified: new Date('2024-06-03'),
      iconSize: 64
    }
  ]);

  const handleIconDoubleClick = (iconId: string) => {
    if (!openWindows.includes(iconId)) {
      setOpenWindows([...openWindows, iconId]);
    }
  };

  const handleIconClick = (iconId: string) => {
    setSelectedIcon(iconId);
    console.log(`Selected ${iconId}`);
  };

  const handleMouseDown = (e: React.MouseEvent, iconId: string) => {
    e.preventDefault();
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
        x: Math.max(0, Math.min(e.clientX - dragOffset.x, window.innerWidth - 120)),
        y: Math.max(40, Math.min(e.clientY - dragOffset.y, window.innerHeight - 150))
      };

      setDesktopIcons(prev => prev.map(icon => 
        icon.id === draggedIcon ? { ...icon, position: newPosition } : icon
      ));
    }
  };

  const handleMouseUp = () => {
    setDraggedIcon(null);
    setDragOffset({ x: 0, y: 0 });
  };

  const handleRefresh = () => {
    console.log('Desktop refreshed');
    setSortBy(current => current);
  };

  const handlePaste = () => {
    console.log('Paste action');
  };

  const handleSortBy = (sortType: SortBy) => {
    setSortBy(sortType);
    console.log(`Sorted by ${sortType}`);
  };

  const handleViewChange = (viewType: ViewMode) => {
    setViewMode(viewType);
    console.log(`View changed to ${viewType}`);
  };

  const handleResizeIcon = (iconId: string, increase: boolean) => {
    setDesktopIcons(prev => prev.map(icon => {
      if (icon.id === iconId) {
        const currentSize = icon.iconSize || 64;
        const newSize = increase 
          ? Math.min(currentSize + 16, 128) 
          : Math.max(currentSize - 16, 32);
        return { ...icon, iconSize: newSize };
      }
      return icon;
    }));
  };

  // Get icon size based on view mode or custom size
  const getIconSize = (icon?: DesktopIcon) => {
    if (icon && icon.iconSize) {
      return {
        container: `w-${Math.floor(icon.iconSize / 4)} h-${Math.floor(icon.iconSize / 4)}`,
        icon: `w-${Math.floor(icon.iconSize / 8)} h-${Math.floor(icon.iconSize / 8)}`,
        text: 'text-xs'
      };
    }
    
    switch (viewMode) {
      case 'large-icons': return { container: 'w-16 h-16', icon: 'w-8 h-8', text: 'text-xs' };
      case 'medium-icons': return { container: 'w-12 h-12', icon: 'w-6 h-6', text: 'text-xs' };
      case 'small-icons': return { container: 'w-8 h-8', icon: 'w-4 h-4', text: 'text-xs' };
      case 'list': return { container: 'w-6 h-6', icon: 'w-4 h-4', text: 'text-sm' };
    }
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
          {desktopIcons.map((icon) => {
            const iconSizes = getIconSize(icon);
            const isSelected = selectedIcon === icon.id;
            return (
              <div key={icon.id} className="absolute">
                <div
                  className={`${viewMode === 'list' ? 'flex flex-row items-center space-x-3 w-full max-w-xs' : 'flex flex-col items-center'} cursor-pointer group select-none ${
                    isSelected ? 'ring-2 ring-blue-400 rounded-lg' : ''
                  }`}
                  style={{ 
                    left: icon.position.x, 
                    top: icon.position.y,
                    width: icon.iconSize ? `${icon.iconSize + 20}px` : 'auto'
                  }}
                  onClick={() => handleIconClick(icon.id)}
                  onDoubleClick={() => handleIconDoubleClick(icon.id)}
                  onMouseDown={(e) => handleMouseDown(e, icon.id)}
                >
                  <div 
                    className={`${icon.color} rounded-lg flex items-center justify-center group-hover:scale-105 transition-all duration-200 shadow-lg`}
                    style={{
                      width: icon.iconSize || 64,
                      height: icon.iconSize || 64
                    }}
                  >
                    <icon.icon 
                      className="text-white" 
                      size={icon.iconSize ? icon.iconSize / 2 : 32}
                    />
                  </div>
                  <span className={`text-white ${iconSizes.text} ${viewMode === 'list' ? 'flex-1' : 'mt-2'} bg-black/30 px-2 py-1 rounded backdrop-blur-sm max-w-full text-center truncate`}>
                    {icon.name}
                  </span>
                  {viewMode === 'list' && (
                    <div className="text-white text-xs bg-black/30 px-2 py-1 rounded backdrop-blur-sm">
                      {icon.size}KB
                    </div>
                  )}
                </div>
                
                {/* Resize controls when icon is selected */}
                {isSelected && (
                  <div 
                    className="absolute flex space-x-1 bg-black/50 rounded p-1"
                    style={{ 
                      left: icon.position.x + (icon.iconSize || 64) + 10, 
                      top: icon.position.y 
                    }}
                  >
                    <button
                      onClick={() => handleResizeIcon(icon.id, false)}
                      className="w-6 h-6 bg-red-500 hover:bg-red-600 rounded flex items-center justify-center"
                    >
                      <Minus className="w-3 h-3 text-white" />
                    </button>
                    <button
                      onClick={() => handleResizeIcon(icon.id, true)}
                      className="w-6 h-6 bg-green-500 hover:bg-green-600 rounded flex items-center justify-center"
                    >
                      <Plus className="w-3 h-3 text-white" />
                    </button>
                  </div>
                )}
              </div>
            );
          })}

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
              <span className={sortBy === 'name' ? 'font-bold' : ''}>Name</span>
            </ContextMenuItem>
            <ContextMenuItem onClick={() => handleSortBy('size')}>
              <span className={sortBy === 'size' ? 'font-bold' : ''}>Size</span>
            </ContextMenuItem>
            <ContextMenuItem onClick={() => handleSortBy('date')}>
              <span className={sortBy === 'date' ? 'font-bold' : ''}>Date modified</span>
            </ContextMenuItem>
            <ContextMenuItem onClick={() => handleSortBy('type')}>
              <span className={sortBy === 'type' ? 'font-bold' : ''}>Type</span>
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
              <span className={viewMode === 'large-icons' ? 'font-bold' : ''}>Large icons</span>
            </ContextMenuItem>
            <ContextMenuItem onClick={() => handleViewChange('medium-icons')}>
              <span className={viewMode === 'medium-icons' ? 'font-bold' : ''}>Medium icons</span>
            </ContextMenuItem>
            <ContextMenuItem onClick={() => handleViewChange('small-icons')}>
              <span className={viewMode === 'small-icons' ? 'font-bold' : ''}>Small icons</span>
            </ContextMenuItem>
            <ContextMenuItem onClick={() => handleViewChange('list')}>
              <span className={viewMode === 'list' ? 'font-bold' : ''}>List</span>
            </ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>
      </ContextMenuContent>
    </ContextMenu>
  );
};
