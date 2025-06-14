
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Monitor, Cpu, HardDrive, MemoryStick, Shield, Edit } from 'lucide-react';

export const SystemOverview = () => {
  const [deviceName, setDeviceName] = useState('ZOREN-WORKSTATION');
  const [isEditing, setIsEditing] = useState(false);
  const [systemHealth, setSystemHealth] = useState('Excellent');

  const systemInfo = {
    osVersion: 'ZOREN OS PRO v1.0.2024',
    processor: 'Intel Core i7-12700K @ 3.60GHz',
    memory: '32.0 GB DDR4',
    storage: '1TB NVMe SSD (85% free)',
    graphics: 'NVIDIA GeForce RTX 4070',
    uptime: '2 days, 14 hours, 23 minutes'
  };

  useEffect(() => {
    const saved = localStorage.getItem('zorenDeviceName');
    if (saved) setDeviceName(saved);
  }, []);

  const handleSaveDeviceName = () => {
    localStorage.setItem('zorenDeviceName', deviceName);
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Monitor className="w-8 h-8 text-green-400" />
        <h1 className="text-2xl font-bold text-green-400">System Overview</h1>
      </div>

      {/* Device Name */}
      <Card className="bg-gray-800 border-green-500/30">
        <CardHeader>
          <CardTitle className="text-green-400 flex items-center gap-2">
            <Edit className="w-5 h-5" />
            Device Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <label className="text-gray-300 w-24">Device Name:</label>
            {isEditing ? (
              <div className="flex gap-2">
                <Input
                  value={deviceName}
                  onChange={(e) => setDeviceName(e.target.value)}
                  className="bg-gray-700 border-green-500/50 text-green-400"
                />
                <Button onClick={handleSaveDeviceName} size="sm" className="bg-green-600 hover:bg-green-700">
                  Save
                </Button>
                <Button onClick={() => setIsEditing(false)} variant="outline" size="sm">
                  Cancel
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-green-400 font-mono">{deviceName}</span>
                <Button onClick={() => setIsEditing(true)} variant="ghost" size="sm">
                  <Edit className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* System Information */}
      <Card className="bg-gray-800 border-green-500/30">
        <CardHeader>
          <CardTitle className="text-green-400 flex items-center gap-2">
            <Cpu className="w-5 h-5" />
            System Specifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <label className="text-gray-400 text-sm">Operating System</label>
                <p className="text-green-400 font-mono">{systemInfo.osVersion}</p>
              </div>
              <div>
                <label className="text-gray-400 text-sm">Processor</label>
                <p className="text-green-400 font-mono">{systemInfo.processor}</p>
              </div>
              <div>
                <label className="text-gray-400 text-sm">Memory (RAM)</label>
                <p className="text-green-400 font-mono">{systemInfo.memory}</p>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-gray-400 text-sm">Storage</label>
                <p className="text-green-400 font-mono">{systemInfo.storage}</p>
              </div>
              <div>
                <label className="text-gray-400 text-sm">Graphics</label>
                <p className="text-green-400 font-mono">{systemInfo.graphics}</p>
              </div>
              <div>
                <label className="text-gray-400 text-sm">System Uptime</label>
                <p className="text-green-400 font-mono">{systemInfo.uptime}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Health */}
      <Card className="bg-gray-800 border-green-500/30">
        <CardHeader>
          <CardTitle className="text-green-400 flex items-center gap-2">
            <Shield className="w-5 h-5" />
            System Health Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Overall Status</p>
              <p className={`text-lg font-bold ${systemHealth === 'Excellent' ? 'text-green-400' : 'text-yellow-400'}`}>
                {systemHealth}
              </p>
            </div>
            <Button 
              onClick={() => setSystemHealth(systemHealth === 'Excellent' ? 'Good' : 'Excellent')}
              className="bg-green-600 hover:bg-green-700"
            >
              Run Health Check
            </Button>
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">CPU Temperature</span>
              <span className="text-green-400">42°C</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Memory Usage</span>
              <span className="text-green-400">68%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Disk Health</span>
              <span className="text-green-400">Optimal</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
