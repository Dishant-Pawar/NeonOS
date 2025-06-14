
import React from 'react';
import { Search, Grid3X3, Calendar, Clock, Folder, Terminal, Settings, Wifi, Volume2, Minus, X } from 'lucide-react';
import { useDemoContext } from './DemoContext';

export const Taskbar = () => {
  const { openWindows, setOpenWindows, minimizedWindows, setMinimizedWindows, maximizedWindows, setMaximizedWindows, systemSettings } = useDemoContext();

  const quickLaunchApps = [
    { id: 'file-manager', name: 'Files', icon: Folder },
    { id: 'terminal', name: 'Terminal', icon: Terminal },
    { id: 'system-settings', name: 'Settings', icon: Settings },
  ];

  const openApp = (appId: string) => {
    if (!openWindows.includes(appId)) {
      setOpenWindows([...openWindows, appId]);
    } else if (minimizedWindows.includes(appId)) {
      // Restore minimized window
      setMinimizedWindows(minimizedWindows.filter(id => id !== appId));
    }
  };

  const focusApp = (appId: string) => {
    if (minimizedWindows.includes(appId)) {
      // Restore minimized window
      setMinimizedWindows(minimizedWindows.filter(id => id !== appId));
    } else {
      // In a real OS, this would bring the window to front
      console.log(`Focusing ${appId}`);
    }
  };

  const closeApp = (appId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenWindows(openWindows.filter(id => id !== appId));
    setMinimizedWindows(minimizedWindows.filter(id => id !== appId));
    setMaximizedWindows(maximizedWindows.filter(id => id !== appId));
  };

  const getAppName = (id: string) => {
    const names: Record<string, string> = {
      'file-manager': 'Files',
      'terminal': 'Terminal',
      'app-drawer': 'Apps',
      'wifi-finder': 'WiFi',
      'antivirus': 'Antivirus',
      'camera': 'Camera',
      'task-manager': 'Tasks',
      'system-settings': 'Settings',
      'music-player': 'Music',
      'writer': 'Writer',
      'browser': 'Browser',
      'mail': 'Mail',
      'image-editor': 'Image Editor',
      'code-editor': 'Code Editor',
      'calculator-app': 'Calculator',
      'snake-game': 'Snake',
      'memory-game': 'Memory',
      'tetris-game': 'Tetris',
    };
    return names[id] || id;
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 h-12 bg-black/40 backdrop-blur-md border-t border-white/10 flex items-center px-4 z-30">
      {/* Start Button */}
      <button 
        onClick={() => openApp('app-drawer')}
        className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-500 hover:to-purple-500 transition-all duration-200 mr-3"
      >
        <Grid3X3 className="w-5 h-5 text-white" />
      </button>

      {/* Search */}
      <div className="flex items-center bg-white/10 rounded-lg px-3 py-2 mr-3 min-w-48">
        <Search className="w-4 h-4 text-white/70 mr-2" />
        <input 
          type="text" 
          placeholder="Search RAVAN OS..." 
          className="bg-transparent text-white text-sm placeholder-white/50 outline-none flex-1"
        />
      </div>

      {/* Quick Launch */}
      <div className="flex items-center space-x-2 mr-4">
        {quickLaunchApps.map((app) => (
          <button
            key={app.id}
            onClick={() => openApp(app.id)}
            className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-all duration-200"
            title={app.name}
          >
            <app.icon className="w-5 h-5 text-white" />
          </button>
        ))}
      </div>

      {/* Running Applications */}
      <div className="flex items-center space-x-1 flex-1">
        {openWindows.map((windowId) => {
          const isMinimized = minimizedWindows.includes(windowId);
          return (
            <button
              key={windowId}
              onClick={() => focusApp(windowId)}
              className={`px-3 py-2 rounded-lg text-white text-sm transition-all duration-200 flex items-center space-x-2 max-w-32 group relative ${
                isMinimized 
                  ? 'bg-white/10 hover:bg-white/20 border border-yellow-400/50' 
                  : 'bg-white/20 hover:bg-white/30'
              }`}
              title={`${getAppName(windowId)}${isMinimized ? ' (minimized)' : ''}`}
            >
              {isMinimized && <Minus className="w-3 h-3 text-yellow-400" />}
              <div className={`w-2 h-2 rounded-full ${isMinimized ? 'bg-yellow-400' : 'bg-green-400'}`}></div>
              <span className="truncate flex-1">{getAppName(windowId)}</span>
              <button
                onClick={(e) => closeApp(windowId, e)}
                className="ml-1 opacity-0 group-hover:opacity-100 hover:bg-red-500/20 rounded p-0.5 transition-all duration-200"
                title="Close"
              >
                <X className="w-3 h-3 text-white" />
              </button>
            </button>
          );
        })}
      </div>

      {/* System Tray */}
      <div className="flex items-center space-x-3 ml-4">
        {/* System Status */}
        <div className="flex items-center space-x-2">
          <Wifi className={`w-4 h-4 ${systemSettings.wifi ? 'text-green-400' : 'text-gray-400'}`} />
          <Volume2 className="w-4 h-4 text-white" />
          <div className="text-white text-xs">
            {systemSettings.volume}%
          </div>
        </div>

        {/* Date and Time */}
        <div className="text-white text-sm text-right">
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>{new Date().toLocaleTimeString('en-US', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}</span>
          </div>
          <div className="text-xs text-white/70 flex items-center space-x-1">
            <Calendar className="w-3 h-3" />
            <span>{new Date().toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric' 
            })}</span>
          </div>
        </div>

        {/* Show Desktop Button */}
        <button 
          onClick={() => {
            setOpenWindows([]);
            setMinimizedWindows([]);
          }}
          className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded border border-white/20 transition-all duration-200"
          title="Show Desktop"
        >
        </button>
      </div>
    </div>
  );
};
