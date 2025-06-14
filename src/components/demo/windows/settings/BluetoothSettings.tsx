
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Bluetooth, Headphones, Keyboard, Mouse, Printer, Plus } from 'lucide-react';

export const BluetoothSettings = () => {
  const [bluetoothEnabled, setBluetoothEnabled] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [devices, setDevices] = useState([
    { name: 'ZOREN Wireless Keyboard', type: 'keyboard', connected: true, battery: 85 },
    { name: 'Gaming Mouse Pro', type: 'mouse', connected: true, battery: 62 },
    { name: 'Sony WH-1000XM4', type: 'headphones', connected: false, battery: null },
    { name: 'HP LaserJet Pro', type: 'printer', connected: false, battery: null }
  ]);

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'keyboard': return Keyboard;
      case 'mouse': return Mouse;
      case 'headphones': return Headphones;
      case 'printer': return Printer;
      default: return Bluetooth;
    }
  };

  const scanForDevices = () => {
    setScanning(true);
    setTimeout(() => {
      const newDevices = [
        'iPhone 15 Pro',
        'Samsung Galaxy Buds',
        'Logitech Speaker',
        'Apple Watch'
      ];
      const randomDevice = newDevices[Math.floor(Math.random() * newDevices.length)];
      setDevices([...devices, {
        name: randomDevice,
        type: 'headphones',
        connected: false,
        battery: null
      }]);
      setScanning(false);
    }, 3000);
  };

  const toggleConnection = (deviceName: string) => {
    setDevices(devices.map(device => 
      device.name === deviceName 
        ? { ...device, connected: !device.connected }
        : device
    ));
  };

  const removeDevice = (deviceName: string) => {
    setDevices(devices.filter(device => device.name !== deviceName));
  };

  useEffect(() => {
    const saved = localStorage.getItem('zorenBluetoothSettings');
    if (saved) {
      const settings = JSON.parse(saved);
      setBluetoothEnabled(settings.bluetoothEnabled || false);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('zorenBluetoothSettings', JSON.stringify({ bluetoothEnabled }));
  }, [bluetoothEnabled]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Bluetooth className="w-8 h-8 text-green-400" />
        <h1 className="text-2xl font-bold text-green-400">Bluetooth & Devices</h1>
      </div>

      {/* Bluetooth Toggle */}
      <Card className="bg-gray-800 border-green-500/30">
        <CardHeader>
          <CardTitle className="text-green-400 flex items-center gap-2">
            <Bluetooth className="w-5 h-5" />
            Bluetooth
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-400 font-medium">Bluetooth</p>
              <p className="text-gray-400 text-sm">Make your device discoverable</p>
            </div>
            <Switch checked={bluetoothEnabled} onCheckedChange={setBluetoothEnabled} />
          </div>
        </CardContent>
      </Card>

      {bluetoothEnabled && (
        <>
          {/* Device List */}
          <Card className="bg-gray-800 border-green-500/30">
            <CardHeader>
              <CardTitle className="text-green-400 flex items-center justify-between">
                Paired Devices
                <Button 
                  onClick={scanForDevices}
                  disabled={scanning}
                  size="sm"
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  {scanning ? 'Scanning...' : 'Add Device'}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {devices.map((device, index) => {
                  const Icon = getDeviceIcon(device.type);
                  return (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Icon className="w-6 h-6 text-green-400" />
                        <div>
                          <p className="text-green-400 font-medium">{device.name}</p>
                          <div className="flex items-center gap-2 text-sm">
                            <span className={device.connected ? 'text-green-400' : 'text-gray-400'}>
                              {device.connected ? 'Connected' : 'Not connected'}
                            </span>
                            {device.battery && (
                              <span className="text-gray-400">• {device.battery}% battery</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => toggleConnection(device.name)}
                          className={device.connected ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'}
                        >
                          {device.connected ? 'Disconnect' : 'Connect'}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => removeDevice(device.name)}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {scanning && (
                <div className="flex items-center justify-center py-8">
                  <div className="text-center">
                    <div className="animate-spin w-8 h-8 border-2 border-green-400 border-t-transparent rounded-full mx-auto mb-2"></div>
                    <p className="text-green-400">Scanning for devices...</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Input Devices */}
          <Card className="bg-gray-800 border-green-500/30">
            <CardHeader>
              <CardTitle className="text-green-400">Input Device Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Keyboard className="w-5 h-5 text-green-400" />
                    <div>
                      <p className="text-green-400">Keyboard Settings</p>
                      <p className="text-gray-400 text-sm">Repeat rate, special keys</p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">Configure</Button>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Mouse className="w-5 h-5 text-green-400" />
                    <div>
                      <p className="text-green-400">Mouse Settings</p>
                      <p className="text-gray-400 text-sm">Sensitivity, scrolling</p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">Configure</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};
