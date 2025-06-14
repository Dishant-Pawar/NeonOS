
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
}

const DemoContext = createContext<DemoContextType | undefined>(undefined);

export const DemoProvider = ({ children }: { children: ReactNode }) => {
  const [openWindows, setOpenWindows] = useState<string[]>([]);
  const [minimizedWindows, setMinimizedWindows] = useState<string[]>([]);
  const [maximizedWindows, setMaximizedWindows] = useState<string[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
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
