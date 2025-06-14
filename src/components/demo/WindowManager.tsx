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
import { SnakeGameWindow } from './windows/SnakeGameWindow';
import { MemoryGameWindow } from './windows/MemoryGameWindow';
import { TetrisGameWindow } from './windows/TetrisGameWindow';

export const WindowManager = () => {
  const { 
    openWindows, 
    setOpenWindows, 
    minimizedWindows, 
    setMinimizedWindows,
    maximizedWindows,
    setMaximizedWindows
  } = useDemoContext();

  const closeWindow = (windowId: string) => {
    setOpenWindows(openWindows.filter(id => id !== windowId));
    setMinimizedWindows(minimizedWindows.filter(id => id !== windowId));
    setMaximizedWindows(maximizedWindows.filter(id => id !== windowId));
  };

  const minimizeWindow = (windowId: string) => {
    if (!minimizedWindows.includes(windowId)) {
      setMinimizedWindows([...minimizedWindows, windowId]);
    }
  };

  const restoreWindow = (windowId: string) => {
    setMinimizedWindows(minimizedWindows.filter(id => id !== windowId));
  };

  const maximizeWindow = (windowId: string) => {
    if (maximizedWindows.includes(windowId)) {
      // Restore from maximized
      setMaximizedWindows(maximizedWindows.filter(id => id !== windowId));
    } else {
      // Maximize window
      setMaximizedWindows([...maximizedWindows, windowId]);
    }
  };

  // Only render windows that are not minimized
  const visibleWindows = openWindows.filter(windowId => !minimizedWindows.includes(windowId));

  return (
    <>
      {visibleWindows.map((windowId, index) => {
        const zIndex = 20 + index;
        const isMaximized = maximizedWindows.includes(windowId);
        
        switch (windowId) {
          case 'file-manager':
            return (
              <FileManagerWindow
                key={windowId}
                onClose={() => closeWindow(windowId)}
                onMinimize={() => minimizeWindow(windowId)}
                onMaximize={() => maximizeWindow(windowId)}
                zIndex={zIndex}
                isMaximized={isMaximized}
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
                isMaximized={isMaximized}
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
                isMaximized={isMaximized}
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
                isMaximized={isMaximized}
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
                isMaximized={isMaximized}
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
                isMaximized={isMaximized}
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
                isMaximized={isMaximized}
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
                isMaximized={isMaximized}
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
                isMaximized={isMaximized}
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
                isMaximized={isMaximized}
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
                isMaximized={isMaximized}
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
                isMaximized={isMaximized}
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
                isMaximized={isMaximized}
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
                isMaximized={isMaximized}
              />
            );
          case 'snake-game':
            return (
              <SnakeGameWindow
                key={windowId}
                onClose={() => closeWindow(windowId)}
                onMinimize={() => minimizeWindow(windowId)}
                onMaximize={() => maximizeWindow(windowId)}
                zIndex={zIndex}
                isMaximized={isMaximized}
              />
            );
          case 'memory-game':
            return (
              <MemoryGameWindow
                key={windowId}
                onClose={() => closeWindow(windowId)}
                onMinimize={() => minimizeWindow(windowId)}
                onMaximize={() => maximizeWindow(windowId)}
                zIndex={zIndex}
                isMaximized={isMaximized}
              />
            );
          case 'tetris-game':
            return (
              <TetrisGameWindow
                key={windowId}
                onClose={() => closeWindow(windowId)}
                onMinimize={() => minimizeWindow(windowId)}
                onMaximize={() => maximizeWindow(windowId)}
                zIndex={zIndex}
                isMaximized={isMaximized}
              />
            );
          default:
            return null;
        }
      })}
    </>
  );
};
