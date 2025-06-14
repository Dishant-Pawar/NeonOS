
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Wifi, Shield, Globe, RefreshCw, Lock } from 'lucide-react';

export const NetworkSettings = () => {
  const [wifiEnabled, setWifiEnabled] = useState(true);
  const [vpnEnabled, setVpnEnabled] = useState(false);
  const [vpnIP, setVpnIP] = useState('185.243.218.27');
  const [proxyEnabled, setProxyEnabled] = useState(false);
  const [proxyAddress, setProxyAddress] = useState('');
  const [proxyPort, setProxyPort] = useState('');
  const [scanning, setScanning] = useState(false);
  const [networks, setNetworks] = useState([
    { name: 'ZOREN-5G', signal: 95, secured: true, connected: true },
    { name: 'HomeNetwork_2.4G', signal: 78, secured: true, connected: false },
    { name: 'CoffeeShop_WiFi', signal: 56, secured: false, connected: false },
    { name: 'Neighbor_WiFi', signal: 42, secured: true, connected: false },
    { name: 'Guest_Network', signal: 38, secured: false, connected: false }
  ]);

  const scanNetworks = () => {
    setScanning(true);
    setTimeout(() => {
      setNetworks([
        ...networks,
        { name: 'New_Network_' + Math.floor(Math.random() * 100), signal: Math.floor(Math.random() * 80) + 20, secured: Math.random() > 0.5, connected: false }
      ]);
      setScanning(false);
    }, 2000);
  };

  const connectToNetwork = (networkName: string) => {
    setNetworks(networks.map(net => ({
      ...net,
      connected: net.name === networkName
    })));
  };

  const toggleVPN = () => {
    setVpnEnabled(!vpnEnabled);
    if (!vpnEnabled) {
      const vpnIPs = ['185.243.218.27', '203.156.89.142', '91.207.175.33', '178.62.194.58'];
      setVpnIP(vpnIPs[Math.floor(Math.random() * vpnIPs.length)]);
    }
  };

  useEffect(() => {
    const savedSettings = localStorage.getItem('zorenNetworkSettings');
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      setWifiEnabled(settings.wifiEnabled !== false);
      setVpnEnabled(settings.vpnEnabled || false);
      setProxyEnabled(settings.proxyEnabled || false);
      setProxyAddress(settings.proxyAddress || '');
      setProxyPort(settings.proxyPort || '');
    }
  }, []);

  const saveSettings = () => {
    const settings = {
      wifiEnabled,
      vpnEnabled,
      proxyEnabled,
      proxyAddress,
      proxyPort
    };
    localStorage.setItem('zorenNetworkSettings', JSON.stringify(settings));
  };

  useEffect(() => {
    saveSettings();
  }, [wifiEnabled, vpnEnabled, proxyEnabled, proxyAddress, proxyPort]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Wifi className="w-8 h-8 text-green-400" />
        <h1 className="text-2xl font-bold text-green-400">Network & Internet</h1>
      </div>

      {/* WiFi Settings */}
      <Card className="bg-gray-800 border-green-500/30">
        <CardHeader>
          <CardTitle className="text-green-400 flex items-center gap-2">
            <Wifi className="w-5 h-5" />
            WiFi Finder
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-green-400 font-medium">WiFi</p>
              <p className="text-gray-400 text-sm">Manage wireless connections</p>
            </div>
            <Switch checked={wifiEnabled} onCheckedChange={setWifiEnabled} />
          </div>

          {wifiEnabled && (
            <>
              <div className="flex items-center gap-2 mb-4">
                <Button 
                  onClick={scanNetworks} 
                  disabled={scanning}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {scanning ? <RefreshCw className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                  {scanning ? 'Scanning...' : 'Scan Networks'}
                </Button>
              </div>

              <div className="space-y-2">
                {networks.map((network, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 ${network.signal > 70 ? 'bg-green-400' : network.signal > 40 ? 'bg-yellow-400' : 'bg-red-400'} rounded`}></div>
                        <span className="text-green-400">{network.name}</span>
                        {network.secured && <Lock className="w-4 h-4 text-gray-400" />}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400 text-sm">{network.signal}%</span>
                      {network.connected ? (
                        <span className="text-green-400 text-sm font-medium">Connected</span>
                      ) : (
                        <Button 
                          size="sm" 
                          onClick={() => connectToNetwork(network.name)}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          Connect
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* VPN Settings */}
      <Card className="bg-gray-800 border-green-500/30">
        <CardHeader>
          <CardTitle className="text-green-400 flex items-center gap-2">
            <Shield className="w-5 h-5" />
            VPN Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-green-400 font-medium">VPN Connection</p>
              <p className="text-gray-400 text-sm">Secure your internet connection</p>
            </div>
            <Switch checked={vpnEnabled} onCheckedChange={toggleVPN} />
          </div>

          {vpnEnabled && (
            <div className="space-y-3">
              <div className="p-3 bg-green-500/20 rounded-lg border border-green-500/50">
                <p className="text-green-400 font-medium">VPN Connected</p>
                <p className="text-gray-300 text-sm">Your IP: {vpnIP}</p>
                <p className="text-gray-300 text-sm">Location: Netherlands</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Proxy Settings */}
      <Card className="bg-gray-800 border-green-500/30">
        <CardHeader>
          <CardTitle className="text-green-400 flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Proxy Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-green-400 font-medium">HTTP/SOCKS Proxy</p>
              <p className="text-gray-400 text-sm">Route traffic through proxy server</p>
            </div>
            <Switch checked={proxyEnabled} onCheckedChange={setProxyEnabled} />
          </div>

          {proxyEnabled && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-gray-400 text-sm">Proxy Address</label>
                  <Input
                    value={proxyAddress}
                    onChange={(e) => setProxyAddress(e.target.value)}
                    placeholder="proxy.example.com"
                    className="bg-gray-700 border-green-500/50 text-green-400"
                  />
                </div>
                <div>
                  <label className="text-gray-400 text-sm">Port</label>
                  <Input
                    value={proxyPort}
                    onChange={(e) => setProxyPort(e.target.value)}
                    placeholder="8080"
                    className="bg-gray-700 border-green-500/50 text-green-400"
                  />
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
