
import React from 'react';
import { useDemoContext } from './DemoContext';
import { FileManagerWindow } from './windows/FileManagerWindow';
import { TerminalWindow } from './windows/TerminalWindow';
import { AppDrawerWindow } from './windows/AppDrawerWindow';
import { WiFiFinderWindow } from './windows/WiFiFinderWindow';
import { AntivirusWindow } from './windows/AntivirusWindow';
import { CameraWindow } from './windows/CameraWindow';

export const WindowManager = () => {
  const { openWindows, setOpenWindows } = useDemoContext();

  const closeWindow = (windowId: string) => {
    setOpenWindows(openWindows.filter(id => id !== windowId));
  };

  const minimizeWindow = (windowId: string) => {
    // For demo purposes, minimizing just closes the window
    closeWindow(windowId);
  };

  const maximizeWindow = (windowId: string) => {
    // Toggle maximize state would go here
    console.log(`Maximizing ${windowId}`);
  };

  return (
    <>
      {openWindows.map((windowId, index) => {
        const zIndex = 20 + index;
        
        switch (windowId) {
          case 'file-manager':
            return (
              <FileManagerWindow
                key={windowId}
                onClose={() => closeWindow(windowId)}
                onMinimize={() => minimizeWindow(windowId)}
                onMaximize={() => maximizeWindow(windowId)}
                zIndex={zIndex}
              />
            );
          case 'terminal':
            return (
              <TerminalWindow
                key={windowId}
                onClose={() => closeWindow(windowId)}
                onMinimize={() => minimizeWindow(windowId)}
                onMaximize={() => maximizeWindow(windowId)}
                zIndex={zIndex}
              />
            );
          case 'app-drawer':
            return (
              <AppDrawerWindow
                key={windowId}
                onClose={() => closeWindow(windowId)}
                onMinimize={() => minimizeWindow(windowId)}
                onMaximize={() => maximizeWindow(windowId)}
                zIndex={zIndex}
              />
            );
          case 'wifi-finder':
            return (
              <WiFiFinderWindow
                key={windowId}
                onClose={() => closeWindow(windowId)}
                onMinimize={() => minimizeWindow(windowId)}
                onMaximize={() => maximizeWindow(windowId)}
                zIndex={zIndex}
              />
            );
          case 'antivirus':
            return (
              <AntivirusWindow
                key={windowId}
                onClose={() => closeWindow(windowId)}
                onMinimize={() => minimizeWindow(windowId)}
                onMaximize={() => maximizeWindow(windowId)}
                zIndex={zIndex}
              />
            );
          case 'camera':
            return (
              <CameraWindow
                key={windowId}
                onClose={() => closeWindow(windowId)}
                onMinimize={() => minimizeWindow(windowId)}
                onMaximize={() => maximizeWindow(windowId)}
                zIndex={zIndex}
              />
            );
          default:
            return null;
        }
      })}
    </>
  );
};
