
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SystemSettings {
  wifi: boolean;
  bluetooth: boolean;
  volume: number;
  brightness: number;
  theme: 'dark' | 'light' | 'cyber';
  animations: boolean;
}

interface DemoContextType {
  openWindows: string[];
  setOpenWindows: (windows: string[]) => void;
  minimizedWindows: string[];
  setMinimizedWindows: (windows: string[]) => void;
  systemSettings: SystemSettings;
  setSystemSettings: (settings: SystemSettings) => void;
}

const DemoContext = createContext<DemoContextType | undefined>(undefined);

export const DemoProvider = ({ children }: { children: ReactNode }) => {
  const [openWindows, setOpenWindows] = useState<string[]>([]);
  const [minimizedWindows, setMinimizedWindows] = useState<string[]>([]);
  const [systemSettings, setSystemSettings] = useState<SystemSettings>({
    wifi: true,
    bluetooth: false,
    volume: 75,
    brightness: 80,
    theme: 'cyber',
    animations: true,
  });

  return (
    <DemoContext.Provider value={{
      openWindows,
      setOpenWindows,
      minimizedWindows,
      setMinimizedWindows,
      systemSettings,
      setSystemSettings,
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
