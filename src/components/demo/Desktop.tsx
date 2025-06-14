
import React, { useState } from 'react';
import { Folder, Terminal, AppWindow, Wifi, Shield, Camera, Activity, Settings } from 'lucide-react';
import { useDemoContext } from './DemoContext';
import { WindowManager } from './WindowManager';

interface DesktopIcon {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  position: { x: number; y: number };
}

export const Desktop = () => {
  const { openWindows, setOpenWindows } = useDemoContext();
  
  const desktopIcons: DesktopIcon[] = [
    {
      id: 'file-manager',
      name: 'File Manager',
      icon: Folder,
      position: { x: 50, y: 100 }
    },
    {
      id: 'terminal',
      name: 'Terminal',
      icon: Terminal,
      position: { x: 50, y: 200 }
    },
    {
      id: 'app-drawer',
      name: 'Applications',
      icon: AppWindow,
      position: { x: 50, y: 300 }
    },
    {
      id: 'wifi-finder',
      name: 'WiFi Scanner',
      icon: Wifi,
      position: { x: 50, y: 400 }
    },
    {
      id: 'antivirus',
      name: 'RO360 Antivirus',
      icon: Shield,
      position: { x: 50, y: 500 }
    },
    {
      id: 'camera',
      name: 'RAVAN Camera',
      icon: Camera,
      position: { x: 50, y: 600 }
    },
    {
      id: 'task-manager',
      name: 'Task Manager',
      icon: Activity,
      position: { x: 150, y: 100 }
    },
    {
      id: 'system-settings',
      name: 'System Settings',
      icon: Settings,
      position: { x: 150, y: 200 }
    }
  ];

  const handleIconDoubleClick = (iconId: string) => {
    if (!openWindows.includes(iconId)) {
      setOpenWindows([...openWindows, iconId]);
    }
  };

  const handleIconClick = (iconId: string) => {
    // Single click selection effect
    console.log(`Selected ${iconId}`);
  };

  return (
    <div className="absolute inset-0 pt-8">
      {/* Desktop Icons */}
      {desktopIcons.map((icon) => (
        <div
          key={icon.id}
          className="absolute flex flex-col items-center cursor-pointer group"
          style={{ left: icon.position.x, top: icon.position.y }}
          onClick={() => handleIconClick(icon.id)}
          onDoubleClick={() => handleIconDoubleClick(icon.id)}
        >
          <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center group-hover:bg-white/20 transition-all duration-200 group-hover:scale-105">
            <icon.icon className="w-8 h-8 text-white" />
          </div>
          <span className="text-white text-xs mt-2 bg-black/30 px-2 py-1 rounded backdrop-blur-sm">
            {icon.name}
          </span>
        </div>
      ))}

      {/* Window Manager */}
      <WindowManager />
    </div>
  );
};
