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
  size?: number;
  type: string;
  dateModified: Date;
}

type ViewMode = 'large-icons' | 'medium-icons' | 'small-icons' | 'list';
type SortBy = 'name' | 'size' | 'date' | 'type';

export const Desktop = () => {
  const { openWindows, setOpenWindows } = useDemoContext();
  const [draggedIcon, setDraggedIcon] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [viewMode, setViewMode] = useState<ViewMode>('large-icons');
  const [sortBy, setSortBy] = useState<SortBy>('name');
  
  const [baseIcons] = useState<DesktopIcon[]>([
    {
      id: 'file-manager',
      name: 'File Manager',
      icon: Folder,
      position: { x: 60, y: 120 },
      color: 'bg-gradient-to-br from-blue-500 to-blue-600',
      size: 245,
      type: 'System',
      dateModified: new Date('2024-06-10')
    },
    {
      id: 'terminal',
      name: 'Terminal',
      icon: Terminal,
      position: { x: 60, y: 240 },
      color: 'bg-gradient-to-br from-gray-700 to-gray-800',
      size: 180,
      type: 'System',
      dateModified: new Date('2024-06-12')
    },
    {
      id: 'app-drawer',
      name: 'Applications',
      icon: AppWindow,
      position: { x: 60, y: 360 },
      color: 'bg-gradient-to-br from-purple-500 to-purple-600',
      size: 320,
      type: 'System',
      dateModified: new Date('2024-06-11')
    },
    {
      id: 'wifi-finder',
      name: 'WiFi Scanner',
      icon: Wifi,
      position: { x: 60, y: 480 },
      color: 'bg-gradient-to-br from-green-500 to-green-600',
      size: 156,
      type: 'Network',
      dateModified: new Date('2024-06-09')
    },
    {
      id: 'antivirus',
      name: 'RO360 Antivirus',
      icon: Shield,
      position: { x: 60, y: 600 },
      color: 'bg-gradient-to-br from-red-500 to-red-600',
      size: 512,
      type: 'Security',
      dateModified: new Date('2024-06-13')
    },
    {
      id: 'camera',
      name: 'RAVAN Camera',
      icon: Camera,
      position: { x: 200, y: 120 },
      color: 'bg-gradient-to-br from-pink-500 to-pink-600',
      size: 89,
      type: 'Media',
      dateModified: new Date('2024-06-08')
    },
    {
      id: 'task-manager',
      name: 'Task Manager',
      icon: Activity,
      position: { x: 200, y: 240 },
      color: 'bg-gradient-to-br from-orange-500 to-orange-600',
      size: 134,
      type: 'System',
      dateModified: new Date('2024-06-14')
    },
    {
      id: 'system-settings',
      name: 'System Settings',
      icon: Settings,
      position: { x: 200, y: 360 },
      color: 'bg-gradient-to-br from-slate-600 to-slate-700',
      size: 267,
      type: 'System',
      dateModified: new Date('2024-06-07')
    },
    {
      id: 'music-player',
      name: 'Music Player',
      icon: Music,
      position: { x: 200, y: 480 },
      color: 'bg-gradient-to-br from-indigo-500 to-indigo-600',
      size: 45,
      type: 'Media',
      dateModified: new Date('2024-06-06')
    },
    {
      id: 'snake-game',
      name: 'Snake Game',
      icon: Gamepad2,
      position: { x: 200, y: 600 },
      color: 'bg-gradient-to-br from-emerald-500 to-emerald-600',
      size: 78,
      type: 'Games',
      dateModified: new Date('2024-06-05')
    },
    {
      id: 'memory-game',
      name: 'Memory Match',
      icon: Puzzle,
      position: { x: 340, y: 120 },
      color: 'bg-gradient-to-br from-cyan-500 to-cyan-600',
      size: 92,
      type: 'Games',
      dateModified: new Date('2024-06-04')
    },
    {
      id: 'tetris-game',
      name: 'Tetris',
      icon: Zap,
      position: { x: 340, y: 240 },
      color: 'bg-gradient-to-br from-yellow-500 to-yellow-600',
      size: 63,
      type: 'Games',
      dateModified: new Date('2024-06-03')
    }
  ]);

  // Sort and arrange icons
  const getSortedIcons = () => {
    let sorted = [...baseIcons];
    
    switch (sortBy) {
      case 'name':
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'size':
        sorted.sort((a, b) => (b.size || 0) - (a.size || 0));
        break;
      case 'date':
        sorted.sort((a, b) => b.dateModified.getTime() - a.dateModified.getTime());
        break;
      case 'type':
        sorted.sort((a, b) => a.type.localeCompare(b.type));
        break;
    }

    // Auto-arrange icons in grid based on view mode
    const iconSpacing = viewMode === 'large-icons' ? 140 : viewMode === 'medium-icons' ? 120 : 100;
    const iconsPerRow = Math.floor((window.innerWidth - 120) / iconSpacing);
    
    return sorted.map((icon, index) => ({
      ...icon,
      position: viewMode === 'list' 
        ? { x: 60, y: 120 + index * 40 }
        : {
            x: 60 + (index % iconsPerRow) * iconSpacing,
            y: 120 + Math.floor(index / iconsPerRow) * iconSpacing
          }
    }));
  };

  const desktopIcons = getSortedIcons();

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
        x: Math.max(0, Math.min(e.clientX - dragOffset.x, window.innerWidth - 100)),
        y: Math.max(80, Math.min(e.clientY - dragOffset.y, window.innerHeight - 150))
      };

      console.log(`Dragging ${draggedIcon} to`, newPosition);
    }
  };

  const handleMouseUp = () => {
    setDraggedIcon(null);
    setDragOffset({ x: 0, y: 0 });
  };

  const handleRefresh = () => {
    console.log('Desktop refreshed');
    // Force re-render by updating sort
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

  // Get icon size based on view mode
  const getIconSize = () => {
    switch (viewMode) {
      case 'large-icons': return { container: 'w-20 h-20', icon: 'w-10 h-10', text: 'text-sm font-medium', spacing: 'mt-3' };
      case 'medium-icons': return { container: 'w-16 h-16', icon: 'w-8 h-8', text: 'text-xs font-medium', spacing: 'mt-2' };
      case 'small-icons': return { container: 'w-12 h-12', icon: 'w-6 h-6', text: 'text-xs', spacing: 'mt-2' };
      case 'list': return { container: 'w-8 h-8', icon: 'w-5 h-5', text: 'text-sm font-medium', spacing: '' };
    }
  };

  const iconSizes = getIconSize();

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
              className={`absolute ${viewMode === 'list' ? 'flex flex-row items-center space-x-4 w-full max-w-md' : 'flex flex-col items-center'} cursor-pointer group select-none transition-all duration-200`}
              style={{ left: icon.position.x, top: icon.position.y }}
              onClick={() => handleIconClick(icon.id)}
              onDoubleClick={() => handleIconDoubleClick(icon.id)}
              onMouseDown={(e) => handleMouseDown(e, icon.id)}
            >
              <div className={`${iconSizes.container} ${icon.color} rounded-2xl flex items-center justify-center group-hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl border border-white/20 backdrop-blur-sm`}>
                <icon.icon className={`${iconSizes.icon} text-white drop-shadow-lg`} />
              </div>
              <span className={`text-white ${iconSizes.text} ${viewMode === 'list' ? 'flex-1' : iconSizes.spacing} bg-black/40 px-3 py-1.5 rounded-lg backdrop-blur-md border border-white/10 shadow-lg text-center max-w-28 truncate`}>
                {icon.name}
              </span>
              {viewMode === 'list' && (
                <div className="text-white text-xs bg-black/30 px-3 py-1 rounded-lg backdrop-blur-sm border border-white/10">
                  {icon.size}KB
                </div>
              )}
            </div>
          ))}

          {/* Window Manager */}
          <WindowManager />

          {/* Taskbar */}
          <Taskbar />
        </div>
      </ContextMenuTrigger>
      
      <ContextMenuContent className="w-52 bg-black/90 backdrop-blur-md border border-white/20">
        <ContextMenuSub>
          <ContextMenuSubTrigger className="text-white">
            <SortAsc className="w-4 h-4 mr-2" />
            Sort by
          </ContextMenuSubTrigger>
          <ContextMenuSubContent className="bg-black/90 backdrop-blur-md border border-white/20">
            <ContextMenuItem onClick={() => setSortBy('name')} className="text-white hover:bg-white/10">
              <span className={sortBy === 'name' ? 'font-bold text-green-400' : ''}>Name</span>
            </ContextMenuItem>
            <ContextMenuItem onClick={() => setSortBy('size')} className="text-white hover:bg-white/10">
              <span className={sortBy === 'size' ? 'font-bold text-green-400' : ''}>Size</span>
            </ContextMenuItem>
            <ContextMenuItem onClick={() => setSortBy('date')} className="text-white hover:bg-white/10">
              <span className={sortBy === 'date' ? 'font-bold text-green-400' : ''}>Date modified</span>
            </ContextMenuItem>
            <ContextMenuItem onClick={() => setSortBy('type')} className="text-white hover:bg-white/10">
              <span className={sortBy === 'type' ? 'font-bold text-green-400' : ''}>Type</span>
            </ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>
        
        <ContextMenuSeparator className="bg-white/20" />
        
        <ContextMenuItem onClick={() => console.log('Paste action')} className="text-white hover:bg-white/10">
          <Clipboard className="w-4 h-4 mr-2" />
          Paste
        </ContextMenuItem>
        
        <ContextMenuSeparator className="bg-white/20" />
        
        <ContextMenuItem onClick={() => console.log('Desktop refreshed')} className="text-white hover:bg-white/10">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </ContextMenuItem>
        
        <ContextMenuSeparator className="bg-white/20" />
        
        <ContextMenuSub>
          <ContextMenuSubTrigger className="text-white">
            <Eye className="w-4 h-4 mr-2" />
            View
          </ContextMenuSubTrigger>
          <ContextMenuSubContent className="bg-black/90 backdrop-blur-md border border-white/20">
            <ContextMenuItem onClick={() => setViewMode('large-icons')} className="text-white hover:bg-white/10">
              <span className={viewMode === 'large-icons' ? 'font-bold text-green-400' : ''}>Large icons</span>
            </ContextMenuItem>
            <ContextMenuItem onClick={() => setViewMode('medium-icons')} className="text-white hover:bg-white/10">
              <span className={viewMode === 'medium-icons' ? 'font-bold text-green-400' : ''}>Medium icons</span>
            </ContextMenuItem>
            <ContextMenuItem onClick={() => setViewMode('small-icons')} className="text-white hover:bg-white/10">
              <span className={viewMode === 'small-icons' ? 'font-bold text-green-400' : ''}>Small icons</span>
            </ContextMenuItem>
            <ContextMenuItem onClick={() => setViewMode('list')} className="text-white hover:bg-white/10">
              <span className={viewMode === 'list' ? 'font-bold text-green-400' : ''}>List</span>
            </ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>
      </ContextMenuContent>
    </ContextMenu>
  );
};
