import React, { useState, useEffect } from 'react';
import { Bell, Wifi, Bluetooth, Minimize, Volume2 } from 'lucide-react';
import { useDemoContext } from './DemoContext';
import { NotificationPanel } from './NotificationPanel';
import { SystemPanel } from './SystemPanel';

export const TopBar = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSystemPanel, setShowSystemPanel] = useState(false);
  const { notifications, systemSettings } = useDemoContext();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <>
      <div className="absolute top-0 left-0 right-0 h-8 bg-black/20 backdrop-blur-md border-b border-white/10 flex items-center justify-between px-4 text-white text-sm z-40">
        {/* Left Side - RAVAN Logo */}
        <div className="flex items-center space-x-2">
          <div className="text-blue-400 font-bold">RAVAN</div>
        </div>

        {/* Center - Time and Date */}
        <div className="flex items-center space-x-4">
          <span className="font-medium">{formatTime(currentTime)}</span>
          <span className="text-gray-300">{formatDate(currentTime)}</span>
        </div>

        {/* Right Side - System Controls */}
        <div className="flex items-center space-x-3">
          {/* System Status Icons */}
          <button 
            onClick={() => setShowSystemPanel(!showSystemPanel)}
            className="flex items-center space-x-2 hover:bg-white/10 px-2 py-1 rounded"
          >
            <div className="flex items-center">
              <Wifi className={`w-4 h-4 ${systemSettings.wifi ? 'text-green-400' : 'text-gray-400'}`} />
              {systemSettings.connectedSSID && (
                <span className="text-xs text-green-400 ml-1">
                  {systemSettings.connectedSSID}
                </span>
              )}
            </div>
            <Bluetooth className={`w-4 h-4 ${systemSettings.bluetooth ? 'text-blue-400' : 'text-gray-400'}`} />
            <Volume2 className="w-4 h-4" />
          </button>

          {/* Notifications */}
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative hover:bg-white/10 p-1 rounded"
          >
            <Bell className="w-4 h-4" />
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {notifications.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Notification Panel */}
      {showNotifications && (
        <NotificationPanel onClose={() => setShowNotifications(false)} />
      )}

      {/* System Panel */}
      {showSystemPanel && (
        <SystemPanel onClose={() => setShowSystemPanel(false)} />
      )}
    </>
  );
};
