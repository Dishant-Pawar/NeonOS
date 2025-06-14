
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { Download, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';

export const UpdateSettings = () => {
  const [autoUpdates, setAutoUpdates] = useState(true);
  const [isChecking, setIsChecking] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [lastCheck, setLastCheck] = useState('2024-01-15 14:30');
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [currentVersion] = useState('ZOREN OS PRO v1.0.2024');
  const [availableVersion] = useState('ZOREN OS PRO v1.1.2024');

  const checkForUpdates = () => {
    setIsChecking(true);
    setUpdateAvailable(false);
    
    setTimeout(() => {
      setIsChecking(false);
      setUpdateAvailable(Math.random() > 0.5); // 50% chance of update
      setLastCheck(new Date().toLocaleString());
    }, 3000);
  };

  const downloadUpdate = () => {
    setIsDownloading(true);
    setDownloadProgress(0);
    
    const interval = setInterval(() => {
      setDownloadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsDownloading(false);
          setUpdateAvailable(false);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 200);
  };

  useEffect(() => {
    const saved = localStorage.getItem('zorenUpdateSettings');
    if (saved) {
      const settings = JSON.parse(saved);
      setAutoUpdates(settings.autoUpdates !== false);
      setLastCheck(settings.lastCheck || lastCheck);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('zorenUpdateSettings', JSON.stringify({ 
      autoUpdates, 
      lastCheck 
    }));
  }, [autoUpdates, lastCheck]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Download className="w-8 h-8 text-green-400" />
        <h1 className="text-2xl font-bold text-green-400">System Updates</h1>
      </div>

      {/* Current Version */}
      <Card className="bg-gray-800 border-green-500/30">
        <CardHeader>
          <CardTitle className="text-green-400">Current System Version</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-green-400" />
            <div>
              <p className="text-green-400 font-medium">{currentVersion}</p>
              <p className="text-gray-400 text-sm">Installed on January 15, 2024</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Update Check */}
      <Card className="bg-gray-800 border-green-500/30">
        <CardHeader>
          <CardTitle className="text-green-400 flex items-center justify-between">
            Check for Updates
            <Button 
              onClick={checkForUpdates}
              disabled={isChecking || isDownloading}
              className="bg-green-600 hover:bg-green-700"
            >
              {isChecking ? (
                <RefreshCw className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <RefreshCw className="w-4 h-4 mr-2" />
              )}
              {isChecking ? 'Checking...' : 'Check Now'}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <p className="text-gray-400 text-sm">Last checked: {lastCheck}</p>
            </div>

            {updateAvailable && !isDownloading && downloadProgress < 100 && (
              <div className="p-4 bg-blue-500/20 rounded-lg border border-blue-500/50">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-6 h-6 text-blue-400 mt-1" />
                  <div className="flex-1">
                    <h3 className="text-blue-400 font-medium">Update Available</h3>
                    <p className="text-gray-300 text-sm mb-3">
                      {availableVersion} is now available with new features and security improvements.
                    </p>
                    <div className="space-y-2">
                      <h4 className="text-blue-400 font-medium">What's New:</h4>
                      <ul className="text-gray-300 text-sm space-y-1">
                        <li>• Enhanced security protocols</li>
                        <li>• Improved system performance</li>
                        <li>• New ZOREN AI assistant features</li>
                        <li>• Bug fixes and stability improvements</li>
                      </ul>
                    </div>
                    <Button 
                      onClick={downloadUpdate}
                      className="mt-4 bg-blue-600 hover:bg-blue-700"
                    >
                      Download and Install
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {isDownloading && (
              <div className="p-4 bg-green-500/20 rounded-lg border border-green-500/50">
                <div className="flex items-center gap-3 mb-3">
                  <Download className="w-6 h-6 text-green-400" />
                  <div>
                    <h3 className="text-green-400 font-medium">Downloading Update</h3>
                    <p className="text-gray-300 text-sm">{availableVersion}</p>
                  </div>
                </div>
                <Progress value={downloadProgress} className="mb-2" />
                <p className="text-gray-400 text-sm">{Math.round(downloadProgress)}% complete</p>
              </div>
            )}

            {downloadProgress >= 100 && !isDownloading && (
              <div className="p-4 bg-green-500/20 rounded-lg border border-green-500/50">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-green-400" />
                  <div>
                    <h3 className="text-green-400 font-medium">Update Ready</h3>
                    <p className="text-gray-300 text-sm">Restart required to complete installation</p>
                    <Button className="mt-3 bg-green-600 hover:bg-green-700">
                      Restart Now
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {!updateAvailable && !isChecking && (
              <div className="p-4 bg-gray-700 rounded-lg">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-green-400" />
                  <div>
                    <h3 className="text-green-400 font-medium">You're up to date</h3>
                    <p className="text-gray-400 text-sm">ZOREN OS is running the latest version</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Auto Update Settings */}
      <Card className="bg-gray-800 border-green-500/30">
        <CardHeader>
          <CardTitle className="text-green-400">Update Preferences</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-400 font-medium">Automatic Updates</p>
                <p className="text-gray-400 text-sm">Download and install updates automatically</p>
              </div>
              <Switch checked={autoUpdates} onCheckedChange={setAutoUpdates} />
            </div>

            <div className="p-3 bg-gray-700 rounded-lg">
              <h4 className="text-green-400 font-medium mb-2">Update Schedule</h4>
              <p className="text-gray-400 text-sm">Updates will be checked daily at 3:00 AM</p>
              <p className="text-gray-400 text-sm">System will restart automatically if no user activity detected</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
