import React, { createContext, useContext, useState, ReactNode } from 'react';

interface DemoContextType {
  openWindows: string[];
  setOpenWindows: (windows: string[]) => void;
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  removeNotification: (id: string) => void;
  systemSettings: SystemSettings;
  updateSystemSettings: (settings: Partial<SystemSettings>) => void;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error';
  timestamp: number;
}

interface SystemSettings {
  wifi: boolean;
  bluetooth: boolean;
  airplaneMode: boolean;
  volume: number;
  connectedSSID?: string;
}

const DemoContext = createContext<DemoContextType | undefined>(undefined);

export const DemoProvider = ({ children }: { children: ReactNode }) => {
  const [openWindows, setOpenWindows] = useState<string[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'Welcome to RAVAN OS',
      message: 'Your demo environment is ready!',
      type: 'info',
      timestamp: Date.now()
    }
  ]);
  const [systemSettings, setSystemSettings] = useState<SystemSettings>({
    wifi: true,
    bluetooth: false,
    airplaneMode: false,
    volume: 75
  });

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now()
    };
    setNotifications(prev => [newNotification, ...prev]);

    // Auto-remove after 5 seconds
    setTimeout(() => {
      removeNotification(newNotification.id);
    }, 5000);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const updateSystemSettings = (settings: Partial<SystemSettings>) => {
    setSystemSettings(prev => ({ ...prev, ...settings }));
  };

  return (
    <DemoContext.Provider value={{
      openWindows,
      setOpenWindows,
      notifications,
      addNotification,
      removeNotification,
      systemSettings,
      updateSystemSettings
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
