
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Palette, Image, Type, Sparkles } from 'lucide-react';

export const PersonalizationSettings = () => {
  const [theme, setTheme] = useState('dark');
  const [accentColor, setAccentColor] = useState('green');
  const [animations, setAnimations] = useState(true);
  const [selectedFont, setSelectedFont] = useState('JetBrains Mono');
  const [wallpaper, setWallpaper] = useState('cosmic');

  const themes = [
    { id: 'dark', name: 'Dark Mode', preview: 'bg-gray-900' },
    { id: 'light', name: 'Light Mode', preview: 'bg-gray-100' },
    { id: 'neon', name: 'Neon Cyber', preview: 'bg-purple-900' },
    { id: 'hacker', name: 'Cyber Hacker', preview: 'bg-green-900' }
  ];

  const accentColors = [
    { id: 'green', name: 'Matrix Green', color: 'bg-green-500' },
    { id: 'blue', name: 'Cyber Blue', color: 'bg-blue-500' },
    { id: 'red', name: 'Alert Red', color: 'bg-red-500' },
    { id: 'purple', name: 'Neon Purple', color: 'bg-purple-500' }
  ];

  const fonts = [
    'JetBrains Mono',
    'Orbitron',
    'Fira Code',
    'Source Code Pro',
    'Roboto Mono'
  ];

  const wallpapers = [
    { id: 'cosmic', name: 'Cosmic Gradient', preview: 'linear-gradient(45deg, #667eea, #764ba2)' },
    { id: 'matrix', name: 'Matrix Code', preview: 'linear-gradient(45deg, #0f0f0f, #1a5d1a)' },
    { id: 'cyber', name: 'Cyber Grid', preview: 'linear-gradient(45deg, #1a1a2e, #16213e)' },
    { id: 'neon', name: 'Neon City', preview: 'linear-gradient(45deg, #ff006e, #8338ec)' }
  ];

  useEffect(() => {
    const savedSettings = localStorage.getItem('zorenPersonalization');
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      setTheme(settings.theme || 'dark');
      setAccentColor(settings.accentColor || 'green');
      setAnimations(settings.animations !== false);
      setSelectedFont(settings.font || 'JetBrains Mono');
      setWallpaper(settings.wallpaper || 'cosmic');
    }
  }, []);

  const saveSettings = () => {
    const settings = {
      theme,
      accentColor,
      animations,
      font: selectedFont,
      wallpaper
    };
    localStorage.setItem('zorenPersonalization', JSON.stringify(settings));
  };

  useEffect(() => {
    saveSettings();
  }, [theme, accentColor, animations, selectedFont, wallpaper]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Palette className="w-8 h-8 text-green-400" />
        <h1 className="text-2xl font-bold text-green-400">Personalization</h1>
      </div>

      {/* Wallpaper Settings */}
      <Card className="bg-gray-800 border-green-500/30">
        <CardHeader>
          <CardTitle className="text-green-400 flex items-center gap-2">
            <Image className="w-5 h-5" />
            Wallpaper & Background
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {wallpapers.map((wp) => (
              <div
                key={wp.id}
                onClick={() => setWallpaper(wp.id)}
                className={`cursor-pointer rounded-lg p-4 border-2 transition-all ${
                  wallpaper === wp.id
                    ? 'border-green-500 shadow-lg shadow-green-500/20'
                    : 'border-gray-600 hover:border-green-400'
                }`}
                style={{ background: wp.preview }}
              >
                <div className="h-20 rounded flex items-center justify-center">
                  <span className="text-white font-medium">{wp.name}</span>
                </div>
              </div>
            ))}
          </div>
          <Button className="mt-4 bg-green-600 hover:bg-green-700">
            Upload Custom Wallpaper
          </Button>
        </CardContent>
      </Card>

      {/* Theme Settings */}
      <Card className="bg-gray-800 border-green-500/30">
        <CardHeader>
          <CardTitle className="text-green-400">Theme Selection</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {themes.map((t) => (
              <div
                key={t.id}
                onClick={() => setTheme(t.id)}
                className={`cursor-pointer rounded-lg p-4 border-2 transition-all ${
                  theme === t.id
                    ? 'border-green-500 shadow-lg shadow-green-500/20'
                    : 'border-gray-600 hover:border-green-400'
                }`}
              >
                <div className={`h-16 rounded ${t.preview} mb-2`}></div>
                <span className="text-green-400 font-medium">{t.name}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Accent Colors */}
      <Card className="bg-gray-800 border-green-500/30">
        <CardHeader>
          <CardTitle className="text-green-400">Accent Colors</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            {accentColors.map((color) => (
              <button
                key={color.id}
                onClick={() => setAccentColor(color.id)}
                className={`w-16 h-16 rounded-full ${color.color} border-4 transition-all ${
                  accentColor === color.id
                    ? 'border-white shadow-lg'
                    : 'border-gray-600 hover:border-gray-400'
                }`}
                title={color.name}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Font Settings */}
      <Card className="bg-gray-800 border-green-500/30">
        <CardHeader>
          <CardTitle className="text-green-400 flex items-center gap-2">
            <Type className="w-5 h-5" />
            System Font
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={selectedFont} onValueChange={setSelectedFont}>
            <SelectTrigger className="bg-gray-700 border-green-500/50 text-green-400">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-700 border-green-500/50">
              {fonts.map((font) => (
                <SelectItem key={font} value={font} className="text-green-400">
                  <span style={{ fontFamily: font }}>{font}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-gray-400 text-sm mt-2">Preview: <span style={{ fontFamily: selectedFont }}>The quick brown fox jumps over the lazy dog</span></p>
        </CardContent>
      </Card>

      {/* Animation Settings */}
      <Card className="bg-gray-800 border-green-500/30">
        <CardHeader>
          <CardTitle className="text-green-400 flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            Animations & Effects
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-400 font-medium">Smooth Transitions</p>
              <p className="text-gray-400 text-sm">Enable window animations and transitions</p>
            </div>
            <Switch checked={animations} onCheckedChange={setAnimations} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
