
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Code, Terminal, Eye, Grid3X3, FileText } from 'lucide-react';
import { useDemoContext } from '../../DemoContext';

export const AdvancedSettings = () => {
  const { setOpenWindows, openWindows } = useDemoContext();
  const [developerMode, setDeveloperMode] = useState(false);
  const [advancedLogs, setAdvancedLogs] = useState(false);
  const [terminalRoot, setTerminalRoot] = useState(false);
  const [virtualDesktops, setVirtualDesktops] = useState(true);
  const [debugMode, setDebugMode] = useState(false);

  const [systemLogs] = useState([
    { time: '14:23:15', level: 'INFO', message: 'System boot completed successfully' },
    { time: '14:23:16', level: 'INFO', message: 'Network interface eth0 connected' },
    { time: '14:23:18', level: 'WARNING', message: 'Bluetooth device disconnected' },
    { time: '14:23:22', level: 'INFO', message: 'User login successful' },
    { time: '14:23:45', level: 'ERROR', message: 'Failed to load resource: /tmp/cache.dat' },
    { time: '14:24:01', level: 'INFO', message: 'Application "Firefox" started' },
    { time: '14:24:15', level: 'WARNING', message: 'High CPU usage detected (87%)' },
    { time: '14:24:33', level: 'INFO', message: 'Window manager reloaded' }
  ]);

  const openTerminal = () => {
    if (!openWindows.includes('terminal')) {
      setOpenWindows([...openWindows, 'terminal']);
    }
  };

  const openFileManager = () => {
    if (!openWindows.includes('file-manager')) {
      setOpenWindows([...openWindows, 'file-manager']);
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'ERROR': return 'text-red-400';
      case 'WARNING': return 'text-yellow-400';
      case 'INFO': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem('zorenAdvancedSettings');
    if (saved) {
      const settings = JSON.parse(saved);
      setDeveloperMode(settings.developerMode || false);
      setAdvancedLogs(settings.advancedLogs || false);
      setTerminalRoot(settings.terminalRoot || false);
      setVirtualDesktops(settings.virtualDesktops !== false);
      setDebugMode(settings.debugMode || false);
    }
  }, []);

  const saveSettings = () => {
    const settings = {
      developerMode,
      advancedLogs,
      terminalRoot,
      virtualDesktops,
      debugMode
    };
    localStorage.setItem('zorenAdvancedSettings', JSON.stringify(settings));
  };

  useEffect(() => {
    saveSettings();
  }, [developerMode, advancedLogs, terminalRoot, virtualDesktops, debugMode]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Code className="w-8 h-8 text-green-400" />
        <h1 className="text-2xl font-bold text-green-400">Advanced Options</h1>
      </div>

      {/* Developer Options */}
      <Card className="bg-gray-800 border-green-500/30">
        <CardHeader>
          <CardTitle className="text-green-400 flex items-center gap-2">
            <Code className="w-5 h-5" />
            Developer Options
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-400 font-medium">Developer Mode</p>
                <p className="text-gray-400 text-sm">Enable advanced debugging and development tools</p>
              </div>
              <Switch checked={developerMode} onCheckedChange={setDeveloperMode} />
            </div>

            {developerMode && (
              <div className="space-y-3 p-3 bg-gray-700 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300 text-sm">Advanced System Logs</span>
                  <Switch checked={advancedLogs} onCheckedChange={setAdvancedLogs} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300 text-sm">Terminal Root Access</span>
                  <Switch checked={terminalRoot} onCheckedChange={setTerminalRoot} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300 text-sm">Debug Mode</span>
                  <Switch checked={debugMode} onCheckedChange={setDebugMode} />
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <Button onClick={openTerminal} className="bg-green-600 hover:bg-green-700">
                <Terminal className="w-4 h-4 mr-2" />
                Open Terminal
              </Button>
              <Button onClick={openFileManager} variant="outline">
                <FileText className="w-4 h-4 mr-2" />
                System Files
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Virtual Desktops */}
      <Card className="bg-gray-800 border-green-500/30">
        <CardHeader>
          <CardTitle className="text-green-400 flex items-center gap-2">
            <Grid3X3 className="w-5 h-5" />
            Virtual Desktops
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-400 font-medium">Multiple Desktop Spaces</p>
                <p className="text-gray-400 text-sm">Create separate workspaces for different tasks</p>
              </div>
              <Switch checked={virtualDesktops} onCheckedChange={setVirtualDesktops} />
            </div>

            {virtualDesktops && (
              <div className="space-y-3">
                <div className="grid grid-cols-4 gap-2">
                  {[1, 2, 3, 4].map((desktop) => (
                    <div
                      key={desktop}
                      className={`aspect-video bg-gray-700 rounded border-2 cursor-pointer transition-all ${
                        desktop === 1 ? 'border-green-500 bg-green-500/20' : 'border-gray-600 hover:border-green-400'
                      }`}
                    >
                      <div className="p-2 h-full flex flex-col justify-between">
                        <span className="text-xs text-gray-400">Desktop {desktop}</span>
                        {desktop === 1 && (
                          <div className="space-y-1">
                            <div className="w-full h-1 bg-green-400 rounded"></div>
                            <div className="w-3/4 h-1 bg-blue-400 rounded"></div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-gray-400 text-sm">Use Ctrl + Alt + Arrow keys to switch between desktops</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* System Logs */}
      <Card className="bg-gray-800 border-green-500/30">
        <CardHeader>
          <CardTitle className="text-green-400 flex items-center gap-2">
            <Eye className="w-5 h-5" />
            System Logs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-black rounded-lg p-4 font-mono text-sm max-h-64 overflow-y-auto">
            {systemLogs.map((log, index) => (
              <div key={index} className="flex gap-4 mb-1">
                <span className="text-gray-500">{log.time}</span>
                <span className={`font-medium w-16 ${getLevelColor(log.level)}`}>
                  [{log.level}]
                </span>
                <span className="text-gray-300">{log.message}</span>
              </div>
            ))}
          </div>
          <div className="flex gap-2 mt-4">
            <Button size="sm" className="bg-green-600 hover:bg-green-700">
              Export Logs
            </Button>
            <Button size="sm" variant="outline">
              Clear Logs
            </Button>
            <Button size="sm" variant="outline">
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Performance Monitoring */}
      <Card className="bg-gray-800 border-green-500/30">
        <CardHeader>
          <CardTitle className="text-green-400">System Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="p-3 bg-gray-700 rounded-lg text-center">
              <p className="text-gray-400 text-sm">CPU Usage</p>
              <p className="text-green-400 text-xl font-bold">42%</p>
            </div>
            <div className="p-3 bg-gray-700 rounded-lg text-center">
              <p className="text-gray-400 text-sm">Memory Usage</p>
              <p className="text-green-400 text-xl font-bold">68%</p>
            </div>
            <div className="p-3 bg-gray-700 rounded-lg text-center">
              <p className="text-gray-400 text-sm">Disk I/O</p>
              <p className="text-green-400 text-xl font-bold">15%</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
