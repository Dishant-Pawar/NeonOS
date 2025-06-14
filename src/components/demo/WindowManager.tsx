import React from 'react';
import { useDemoContext } from './DemoContext';
import { FileManagerWindow } from './windows/FileManagerWindow';
import { TerminalWindow } from './windows/TerminalWindow';
import { AppDrawerWindow } from './windows/AppDrawerWindow';
import { WiFiFinderWindow } from './windows/WiFiFinderWindow';
import { AntivirusWindow } from './windows/AntivirusWindow';
import { CameraWindow } from './windows/CameraWindow';
import { TaskManagerWindow } from './windows/TaskManagerWindow';
import { WriterWindow } from './windows/WriterWindow';
import { BrowserWindow } from './windows/BrowserWindow';
import { MailWindow } from './windows/MailWindow';
import { ImageEditorWindow } from './windows/ImageEditorWindow';
import { CodeEditorWindow } from './windows/CodeEditorWindow';
import { CalculatorWindow } from './windows/CalculatorWindow';
import { SystemSettingsWindow } from './windows/SystemSettingsWindow';

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
          case 'task-manager':
            return (
              <TaskManagerWindow
                key={windowId}
                onClose={() => closeWindow(windowId)}
                onMinimize={() => minimizeWindow(windowId)}
                onMaximize={() => maximizeWindow(windowId)}
                zIndex={zIndex}
              />
            );
          case 'writer':
            return (
              <WriterWindow
                key={windowId}
                onClose={() => closeWindow(windowId)}
                onMinimize={() => minimizeWindow(windowId)}
                onMaximize={() => maximizeWindow(windowId)}
                zIndex={zIndex}
              />
            );
          case 'browser':
            return (
              <BrowserWindow
                key={windowId}
                onClose={() => closeWindow(windowId)}
                onMinimize={() => minimizeWindow(windowId)}
                onMaximize={() => maximizeWindow(windowId)}
                zIndex={zIndex}
              />
            );
          case 'mail':
            return (
              <MailWindow
                key={windowId}
                onClose={() => closeWindow(windowId)}
                onMinimize={() => minimizeWindow(windowId)}
                onMaximize={() => maximizeWindow(windowId)}
                zIndex={zIndex}
              />
            );
          case 'image-editor':
            return (
              <ImageEditorWindow
                key={windowId}
                onClose={() => closeWindow(windowId)}
                onMinimize={() => minimizeWindow(windowId)}
                onMaximize={() => maximizeWindow(windowId)}
                zIndex={zIndex}
              />
            );
          case 'code-editor':
            return (
              <CodeEditorWindow
                key={windowId}
                onClose={() => closeWindow(windowId)}
                onMinimize={() => minimizeWindow(windowId)}
                onMaximize={() => maximizeWindow(windowId)}
                zIndex={zIndex}
              />
            );
          case 'calculator-app':
            return (
              <CalculatorWindow
                key={windowId}
                onClose={() => closeWindow(windowId)}
                onMinimize={() => minimizeWindow(windowId)}
                onMaximize={() => maximizeWindow(windowId)}
                zIndex={zIndex}
              />
            );
          case 'system-settings':
            return (
              <SystemSettingsWindow
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
