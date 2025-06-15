
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SystemSettings {
  wifi: boolean;
  bluetooth: boolean;
  volume: number;
  brightness: number;
  theme: 'dark' | 'light' | 'cyber';
  animations: boolean;
  airplaneMode: boolean;
  connectedSSID?: string;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error';
  timestamp: number;
}

interface PowerState {
  isShuttingDown: boolean;
  isRestarting: boolean;
  isSleeping: boolean;
}

interface DemoContextType {
  openWindows: string[];
  setOpenWindows: (windows: string[]) => void;
  minimizedWindows: string[];
  setMinimizedWindows: (windows: string[]) => void;
  maximizedWindows: string[];
  setMaximizedWindows: (windows: string[]) => void;
  systemSettings: SystemSettings;
  setSystemSettings: (settings: SystemSettings | ((prev: SystemSettings) => SystemSettings)) => void;
  updateSystemSettings: (settings: Partial<SystemSettings>) => void;
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  removeNotification: (id: string) => void;
  powerState: PowerState;
  performRestart: () => void;
  performShutdown: () => void;
  performSleep: () => void;
  wakeFromSleep: () => void;
}

const DemoContext = createContext<DemoContextType | undefined>(undefined);

export const DemoProvider = ({ children }: { children: ReactNode }) => {
  const [openWindows, setOpenWindows] = useState<string[]>([]);
  const [minimizedWindows, setMinimizedWindows] = useState<string[]>([]);
  const [maximizedWindows, setMaximizedWindows] = useState<string[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [powerState, setPowerState] = useState<PowerState>({
    isShuttingDown: false,
    isRestarting: false,
    isSleeping: false,
  });
  const [systemSettings, setSystemSettings] = useState<SystemSettings>({
    wifi: true,
    bluetooth: false,
    volume: 75,
    brightness: 80,
    theme: 'cyber',
    animations: true,
    airplaneMode: false,
    connectedSSID: undefined,
  });

  const updateSystemSettings = (settings: Partial<SystemSettings>) => {
    setSystemSettings(prev => ({ ...prev, ...settings }));
  };

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: Date.now(),
    };
    setNotifications(prev => [...prev, newNotification]);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const performRestart = () => {
    setPowerState(prev => ({ ...prev, isRestarting: true }));
    addNotification({
      title: 'System Restart',
      message: 'RAVAN OS is restarting...',
      type: 'info'
    });
    
    setTimeout(() => {
      // Simulate restart by reloading the page
      window.location.reload();
    }, 3000);
  };

  const performShutdown = () => {
    setPowerState(prev => ({ ...prev, isShuttingDown: true }));
    addNotification({
      title: 'System Shutdown',
      message: 'RAVAN OS is shutting down...',
      type: 'info'
    });
    
    setTimeout(() => {
      // Close all windows and show shutdown screen
      setOpenWindows([]);
      setMinimizedWindows([]);
      setPowerState(prev => ({ ...prev, isShuttingDown: false }));
      // Navigate to a shutdown screen or hide all content
      document.body.style.background = 'black';
      document.body.innerHTML = '<div style="color: white; text-align: center; padding-top: 45vh; font-size: 24px;">RAVAN OS has been shut down</div>';
    }, 3000);
  };

  const performSleep = () => {
    setPowerState(prev => ({ ...prev, isSleeping: true }));
    addNotification({
      title: 'Sleep Mode',
      message: 'RAVAN OS is entering sleep mode...',
      type: 'info'
    });
  };

  const wakeFromSleep = () => {
    setPowerState(prev => ({ ...prev, isSleeping: false }));
    addNotification({
      title: 'Wake Up',
      message: 'Welcome back to RAVAN OS!',
      type: 'info'
    });
  };

  return (
    <DemoContext.Provider value={{
      openWindows,
      setOpenWindows,
      minimizedWindows,
      setMinimizedWindows,
      maximizedWindows,
      setMaximizedWindows,
      systemSettings,
      setSystemSettings,
      updateSystemSettings,
      notifications,
      addNotification,
      removeNotification,
      powerState,
      performRestart,
      performShutdown,
      performSleep,
      wakeFromSleep,
    }}>
      {children}
    </DemoContext.Provider>
  );
};

export const useDemoContext = () => {
  const context = useContext(DemoContext);
  if (!context) {
    throw new Error('useDemoContext must be used within a DemoProvider');
  }
  return context;
};
