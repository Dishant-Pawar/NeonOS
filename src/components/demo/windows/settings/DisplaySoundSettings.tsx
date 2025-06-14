
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Monitor, Volume2, Headphones, Speaker } from 'lucide-react';

export const DisplaySoundSettings = () => {
  const [resolution, setResolution] = useState('1920x1080');
  const [brightness, setBrightness] = useState([75]);
  const [volume, setVolume] = useState([65]);
  const [audioOutput, setAudioOutput] = useState('speakers');

  const resolutions = [
    '1280x720 (HD)',
    '1920x1080 (Full HD)',
    '2560x1440 (2K)',
    '3840x2160 (4K)'
  ];

  const audioOutputs = [
    { id: 'speakers', name: 'Internal Speakers', icon: Speaker },
    { id: 'headphones', name: 'Bluetooth Headphones', icon: Headphones },
    { id: 'hdmi', name: 'HDMI Audio', icon: Monitor }
  ];

  const handleBrightnessChange = (value: number[]) => {
    setBrightness(value);
    // Apply brightness effect to demo
    document.documentElement.style.filter = `brightness(${value[0] / 100})`;
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value);
    // Play a test sound in a real implementation
  };

  const testAudio = () => {
    // In a real implementation, this would play a test sound
    alert(`Playing test audio through ${audioOutputs.find(a => a.id === audioOutput)?.name}`);
  };

  useEffect(() => {
    const saved = localStorage.getItem('zorenDisplaySoundSettings');
    if (saved) {
      const settings = JSON.parse(saved);
      setResolution(settings.resolution || '1920x1080');
      setBrightness(settings.brightness || [75]);
      setVolume(settings.volume || [65]);
      setAudioOutput(settings.audioOutput || 'speakers');
    }
  }, []);

  const saveSettings = () => {
    const settings = {
      resolution,
      brightness,
      volume,
      audioOutput
    };
    localStorage.setItem('zorenDisplaySoundSettings', JSON.stringify(settings));
  };

  useEffect(() => {
    saveSettings();
  }, [resolution, brightness, volume, audioOutput]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Monitor className="w-8 h-8 text-green-400" />
        <h1 className="text-2xl font-bold text-green-400">Display & Sound</h1>
      </div>

      {/* Display Settings */}
      <Card className="bg-gray-800 border-green-500/30">
        <CardHeader>
          <CardTitle className="text-green-400 flex items-center gap-2">
            <Monitor className="w-5 h-5" />
            Display Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <label className="text-gray-400 text-sm mb-2 block">Screen Resolution</label>
              <Select value={resolution} onValueChange={setResolution}>
                <SelectTrigger className="bg-gray-700 border-green-500/50 text-green-400">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-green-500/50">
                  {resolutions.map((res) => (
                    <SelectItem key={res} value={res} className="text-green-400">
                      {res}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-gray-400 text-sm mb-4 block">
                Screen Brightness: {brightness[0]}%
              </label>
              <Slider
                value={brightness}
                onValueChange={handleBrightnessChange}
                max={100}
                min={10}
                step={5}
                className="w-full"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="p-3 bg-gray-700 rounded-lg text-center">
                <p className="text-gray-400 text-sm">Refresh Rate</p>
                <p className="text-green-400 font-medium">144 Hz</p>
              </div>
              <div className="p-3 bg-gray-700 rounded-lg text-center">
                <p className="text-gray-400 text-sm">Color Depth</p>
                <p className="text-green-400 font-medium">32-bit</p>
              </div>
              <div className="p-3 bg-gray-700 rounded-lg text-center">
                <p className="text-gray-400 text-sm">Display Mode</p>
                <p className="text-green-400 font-medium">Extended</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sound Settings */}
      <Card className="bg-gray-800 border-green-500/30">
        <CardHeader>
          <CardTitle className="text-green-400 flex items-center gap-2">
            <Volume2 className="w-5 h-5" />
            Sound Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <label className="text-gray-400 text-sm mb-4 block">
                Master Volume: {volume[0]}%
              </label>
              <Slider
                value={volume}
                onValueChange={handleVolumeChange}
                max={100}
                min={0}
                step={5}
                className="w-full"
              />
            </div>

            <div>
              <label className="text-gray-400 text-sm mb-2 block">Audio Output Device</label>
              <div className="space-y-2">
                {audioOutputs.map((output) => {
                  const Icon = output.icon;
                  return (
                    <div
                      key={output.id}
                      onClick={() => setAudioOutput(output.id)}
                      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer border-2 transition-all ${
                        audioOutput === output.id
                          ? 'border-green-500 bg-green-500/20'
                          : 'border-gray-600 bg-gray-700 hover:border-green-400'
                      }`}
                    >
                      <Icon className="w-5 h-5 text-green-400" />
                      <span className="text-green-400">{output.name}</span>
                      {audioOutput === output.id && (
                        <span className="text-green-400 text-sm ml-auto">Active</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex gap-3">
              <Button onClick={testAudio} className="bg-green-600 hover:bg-green-700">
                Test Audio
              </Button>
              <Button variant="outline">Advanced Audio Settings</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Display Info */}
      <Card className="bg-gray-800 border-green-500/30">
        <CardHeader>
          <CardTitle className="text-green-400">Display Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-400 text-sm">Display Name</p>
              <p className="text-green-400">ZOREN Monitor 27"</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Graphics Card</p>
              <p className="text-green-400">NVIDIA GeForce RTX 4070</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Color Profile</p>
              <p className="text-green-400">sRGB</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Connection Type</p>
              <p className="text-green-400">DisplayPort 1.4</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
