
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Clock, Globe, Keyboard } from 'lucide-react';

export const TimeLanguageSettings = () => {
  const [autoTime, setAutoTime] = useState(true);
  const [timeZone, setTimeZone] = useState('Asia/Kolkata');
  const [language, setLanguage] = useState('English');
  const [keyboardLayout, setKeyboardLayout] = useState('QWERTY');
  const [dateFormat, setDateFormat] = useState('DD/MM/YYYY');
  const [timeFormat, setTimeFormat] = useState('24-hour');
  const [currentTime, setCurrentTime] = useState(new Date());

  const languages = [
    'English',
    'हिन्दी (Hindi)',
    'मराठी (Marathi)',
    'Español (Spanish)',
    'Français (French)',
    'Deutsch (German)'
  ];

  const timeZones = [
    'Asia/Kolkata (UTC+5:30)',
    'America/New_York (UTC-5)',
    'Europe/London (UTC+0)',
    'Asia/Tokyo (UTC+9)',
    'Australia/Sydney (UTC+11)'
  ];

  const keyboardLayouts = [
    'QWERTY (US)',
    'AZERTY (French)',
    'DVORAK',
    'Devanagari (Hindi)',
    'QWERTZ (German)'
  ];

  const dateFormats = [
    'DD/MM/YYYY',
    'MM/DD/YYYY',
    'YYYY-MM-DD',
    'DD-MM-YYYY'
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem('zorenTimeLanguageSettings');
    if (saved) {
      const settings = JSON.parse(saved);
      setAutoTime(settings.autoTime !== false);
      setTimeZone(settings.timeZone || 'Asia/Kolkata');
      setLanguage(settings.language || 'English');
      setKeyboardLayout(settings.keyboardLayout || 'QWERTY');
      setDateFormat(settings.dateFormat || 'DD/MM/YYYY');
      setTimeFormat(settings.timeFormat || '24-hour');
    }
  }, []);

  const saveSettings = () => {
    const settings = {
      autoTime,
      timeZone,
      language,
      keyboardLayout,
      dateFormat,
      timeFormat
    };
    localStorage.setItem('zorenTimeLanguageSettings', JSON.stringify(settings));
  };

  useEffect(() => {
    saveSettings();
  }, [autoTime, timeZone, language, keyboardLayout, dateFormat, timeFormat]);

  const formatDate = (date: Date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    switch (dateFormat) {
      case 'MM/DD/YYYY':
        return `${month}/${day}/${year}`;
      case 'YYYY-MM-DD':
        return `${year}-${month}-${day}`;
      case 'DD-MM-YYYY':
        return `${day}-${month}-${year}`;
      default:
        return `${day}/${month}/${year}`;
    }
  };

  const formatTime = (date: Date) => {
    if (timeFormat === '24-hour') {
      return date.toLocaleTimeString('en-GB');
    } else {
      return date.toLocaleTimeString('en-US');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Clock className="w-8 h-8 text-green-400" />
        <h1 className="text-2xl font-bold text-green-400">Time & Language</h1>
      </div>

      {/* Current Time Display */}
      <Card className="bg-gray-800 border-green-500/30">
        <CardHeader>
          <CardTitle className="text-green-400">Current Date & Time</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <div className="text-3xl font-mono text-green-400 mb-2">
              {formatTime(currentTime)}
            </div>
            <div className="text-xl text-gray-400">
              {formatDate(currentTime)}
            </div>
            <div className="text-sm text-gray-500 mt-2">
              {timeZone.split(' ')[0]}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Date & Time Settings */}
      <Card className="bg-gray-800 border-green-500/30">
        <CardHeader>
          <CardTitle className="text-green-400 flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Date & Time Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-400 font-medium">Automatic Date & Time</p>
                <p className="text-gray-400 text-sm">Sync with internet time servers</p>
              </div>
              <Switch checked={autoTime} onCheckedChange={setAutoTime} />
            </div>

            <div>
              <label className="text-gray-400 text-sm mb-2 block">Time Zone</label>
              <Select value={timeZone} onValueChange={setTimeZone}>
                <SelectTrigger className="bg-gray-700 border-green-500/50 text-green-400">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-green-500/50">
                  {timeZones.map((tz) => (
                    <SelectItem key={tz} value={tz.split(' ')[0]} className="text-green-400">
                      {tz}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-gray-400 text-sm mb-2 block">Date Format</label>
                <Select value={dateFormat} onValueChange={setDateFormat}>
                  <SelectTrigger className="bg-gray-700 border-green-500/50 text-green-400">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-green-500/50">
                    {dateFormats.map((format) => (
                      <SelectItem key={format} value={format} className="text-green-400">
                        {format}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-gray-400 text-sm mb-2 block">Time Format</label>
                <Select value={timeFormat} onValueChange={setTimeFormat}>
                  <SelectTrigger className="bg-gray-700 border-green-500/50 text-green-400">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-green-500/50">
                    <SelectItem value="24-hour" className="text-green-400">24-hour</SelectItem>
                    <SelectItem value="12-hour" className="text-green-400">12-hour (AM/PM)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Language Settings */}
      <Card className="bg-gray-800 border-green-500/30">
        <CardHeader>
          <CardTitle className="text-green-400 flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Language & Region
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="text-gray-400 text-sm mb-2 block">System Language</label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="bg-gray-700 border-green-500/50 text-green-400">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-green-500/50">
                  {languages.map((lang) => (
                    <SelectItem key={lang} value={lang} className="text-green-400">
                      {lang}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {language !== 'English' && (
              <div className="p-3 bg-blue-500/20 rounded-lg border border-blue-500/50">
                <p className="text-blue-400 text-sm">
                  Language pack for {language} will be downloaded. Restart required to apply changes.
                </p>
                <Button className="mt-2 bg-blue-600 hover:bg-blue-700" size="sm">
                  Download Language Pack
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Keyboard Settings */}
      <Card className="bg-gray-800 border-green-500/30">
        <CardHeader>
          <CardTitle className="text-green-400 flex items-center gap-2">
            <Keyboard className="w-5 h-5" />
            Keyboard Layout
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <label className="text-gray-400 text-sm mb-2 block">Input Method</label>
            <Select value={keyboardLayout} onValueChange={setKeyboardLayout}>
              <SelectTrigger className="bg-gray-700 border-green-500/50 text-green-400">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-green-500/50">
                {keyboardLayouts.map((layout) => (
                  <SelectItem key={layout} value={layout.split(' ')[0]} className="text-green-400">
                    {layout}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="mt-4 p-3 bg-gray-700 rounded-lg">
            <p className="text-green-400 font-medium mb-2">Keyboard Shortcuts</p>
            <div className="space-y-1 text-sm text-gray-400">
              <p>Ctrl + Alt + T: Open Terminal</p>
              <p>Ctrl + Alt + Del: Task Manager</p>
              <p>Super + L: Lock Screen</p>
              <p>Alt + F4: Close Window</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
