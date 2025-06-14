
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Shield, Camera, Mic, MapPin, Database, Eye } from 'lucide-react';

export const PrivacySettings = () => {
  const [firewallEnabled, setFirewallEnabled] = useState(true);
  const [cameraAccess, setCameraAccess] = useState(true);
  const [microphoneAccess, setMicrophoneAccess] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [telemetryEnabled, setTelemetryEnabled] = useState(false);

  const [appPermissions, setAppPermissions] = useState([
    { name: 'RAVAN Camera', camera: true, microphone: false, location: false },
    { name: 'Firefox Browser', camera: false, microphone: true, location: true },
    { name: 'Writer App', camera: false, microphone: false, location: false },
    { name: 'Mail Client', camera: false, microphone: false, location: false }
  ]);

  const toggleAppPermission = (appName: string, permission: string) => {
    setAppPermissions(appPermissions.map(app => 
      app.name === appName 
        ? { ...app, [permission]: !app[permission] }
        : app
    ));
  };

  useEffect(() => {
    const saved = localStorage.getItem('zorenPrivacySettings');
    if (saved) {
      const settings = JSON.parse(saved);
      setFirewallEnabled(settings.firewallEnabled !== false);
      setCameraAccess(settings.cameraAccess !== false);
      setMicrophoneAccess(settings.microphoneAccess !== false);
      setLocationEnabled(settings.locationEnabled || false);
      setTelemetryEnabled(settings.telemetryEnabled || false);
    }
  }, []);

  const saveSettings = () => {
    const settings = {
      firewallEnabled,
      cameraAccess,
      microphoneAccess,
      locationEnabled,
      telemetryEnabled,
      appPermissions
    };
    localStorage.setItem('zorenPrivacySettings', JSON.stringify(settings));
  };

  useEffect(() => {
    saveSettings();
  }, [firewallEnabled, cameraAccess, microphoneAccess, locationEnabled, telemetryEnabled, appPermissions]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Shield className="w-8 h-8 text-green-400" />
        <h1 className="text-2xl font-bold text-green-400">Privacy & Security</h1>
      </div>

      {/* Firewall Settings */}
      <Card className="bg-gray-800 border-green-500/30">
        <CardHeader>
          <CardTitle className="text-green-400 flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Firewall Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-green-400 font-medium">ZOREN Firewall</p>
              <p className="text-gray-400 text-sm">Block unauthorized network access</p>
            </div>
            <Switch checked={firewallEnabled} onCheckedChange={setFirewallEnabled} />
          </div>
          
          {firewallEnabled && (
            <div className="p-3 bg-green-500/20 rounded-lg border border-green-500/50">
              <p className="text-green-400 font-medium">Protection Active</p>
              <p className="text-gray-300 text-sm">127 threats blocked today</p>
            </div>
          )}

          <Button className="mt-4 bg-green-600 hover:bg-green-700">
            Advanced Firewall Settings
          </Button>
        </CardContent>
      </Card>

      {/* Device Permissions */}
      <Card className="bg-gray-800 border-green-500/30">
        <CardHeader>
          <CardTitle className="text-green-400">Device Permissions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Camera className="w-5 h-5 text-green-400" />
                <div>
                  <p className="text-green-400 font-medium">Camera Access</p>
                  <p className="text-gray-400 text-sm">Allow apps to use your camera</p>
                </div>
              </div>
              <Switch checked={cameraAccess} onCheckedChange={setCameraAccess} />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Mic className="w-5 h-5 text-green-400" />
                <div>
                  <p className="text-green-400 font-medium">Microphone Access</p>
                  <p className="text-gray-400 text-sm">Allow apps to use your microphone</p>
                </div>
              </div>
              <Switch checked={microphoneAccess} onCheckedChange={setMicrophoneAccess} />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-green-400" />
                <div>
                  <p className="text-green-400 font-medium">Location Services</p>
                  <p className="text-gray-400 text-sm">Allow apps to access your location</p>
                </div>
              </div>
              <Switch checked={locationEnabled} onCheckedChange={setLocationEnabled} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* App Permissions */}
      <Card className="bg-gray-800 border-green-500/30">
        <CardHeader>
          <CardTitle className="text-green-400 flex items-center gap-2">
            <Eye className="w-5 h-5" />
            App Permissions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {appPermissions.map((app, index) => (
              <div key={index} className="p-3 bg-gray-700 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-green-400 font-medium">{app.name}</p>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">Camera</span>
                    <Switch 
                      checked={app.camera} 
                      onCheckedChange={() => toggleAppPermission(app.name, 'camera')}
                      disabled={!cameraAccess}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">Microphone</span>
                    <Switch 
                      checked={app.microphone} 
                      onCheckedChange={() => toggleAppPermission(app.name, 'microphone')}
                      disabled={!microphoneAccess}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">Location</span>
                    <Switch 
                      checked={app.location} 
                      onCheckedChange={() => toggleAppPermission(app.name, 'location')}
                      disabled={!locationEnabled}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Data Collection */}
      <Card className="bg-gray-800 border-green-500/30">
        <CardHeader>
          <CardTitle className="text-green-400 flex items-center gap-2">
            <Database className="w-5 h-5" />
            Data Collection
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-400 font-medium">Telemetry & Analytics</p>
              <p className="text-gray-400 text-sm">Help improve ZOREN OS by sharing usage data</p>
            </div>
            <Switch checked={telemetryEnabled} onCheckedChange={setTelemetryEnabled} />
          </div>
          
          {!telemetryEnabled && (
            <div className="mt-3 p-3 bg-blue-500/20 rounded-lg border border-blue-500/50">
              <p className="text-blue-400 text-sm">Data collection is disabled. Your privacy is protected.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
