
import React, { useState } from 'react';
import { Window } from '../Window';
import { Settings, Monitor, Wifi, Bluetooth, Shield, Users, Download, Volume2, Clock, Code } from 'lucide-react';
import { SystemOverview } from './settings/SystemOverview';
import { PersonalizationSettings } from './settings/PersonalizationSettings';
import { NetworkSettings } from './settings/NetworkSettings';
import { BluetoothSettings } from './settings/BluetoothSettings';
import { PrivacySettings } from './settings/PrivacySettings';
import { AccountsSettings } from './settings/AccountsSettings';
import { UpdateSettings } from './settings/UpdateSettings';
import { DisplaySoundSettings } from './settings/DisplaySoundSettings';
import { TimeLanguageSettings } from './settings/TimeLanguageSettings';
import { AdvancedSettings } from './settings/AdvancedSettings';

interface SystemSettingsWindowProps {
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  zIndex: number;
}

export const SystemSettingsWindow: React.FC<SystemSettingsWindowProps> = ({
  onClose,
  onMinimize,
  onMaximize,
  zIndex,
}) => {
  const [activeCategory, setActiveCategory] = useState('system');

  const categories = [
    { id: 'system', name: 'System Overview', icon: Monitor },
    { id: 'personalization', name: 'Personalization', icon: Settings },
    { id: 'network', name: 'Network & Internet', icon: Wifi },
    { id: 'bluetooth', name: 'Bluetooth & Devices', icon: Bluetooth },
    { id: 'privacy', name: 'Privacy & Security', icon: Shield },
    { id: 'accounts', name: 'Accounts & Users', icon: Users },
    { id: 'updates', name: 'System Updates', icon: Download },
    { id: 'display', name: 'Display & Sound', icon: Volume2 },
    { id: 'time', name: 'Time & Language', icon: Clock },
    { id: 'advanced', name: 'Advanced Options', icon: Code },
  ];

  return (
    <Window
      title="ZOREN OS System Settings"
      onClose={onClose}
      onMinimize={onMinimize}
      onMaximize={onMaximize}
      zIndex={zIndex}
      initialSize={{ width: 1000, height: 700 }}
    >
      <div className="flex h-full bg-gray-900 text-green-400">
        {/* Sidebar */}
        <div className="w-64 bg-black border-r border-green-500/30">
          <div className="p-4 border-b border-green-500/30">
            <h2 className="text-lg font-bold text-green-400 mb-2">ZOREN OS</h2>
            <p className="text-sm text-gray-400">System Configuration</p>
          </div>
          <nav className="p-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg mb-1 transition-all ${
                  activeCategory === category.id
                    ? 'bg-green-500/20 text-green-400 border border-green-500/50 shadow-lg shadow-green-500/20'
                    : 'text-gray-400 hover:bg-green-500/10 hover:text-green-300'
                }`}
              >
                <category.icon className="w-5 h-5" />
                <span className="text-sm font-medium">{category.name}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-6">
            {activeCategory === 'system' && <SystemOverview />}
            {activeCategory === 'personalization' && <PersonalizationSettings />}
            {activeCategory === 'network' && <NetworkSettings />}
            {activeCategory === 'bluetooth' && <BluetoothSettings />}
            {activeCategory === 'privacy' && <PrivacySettings />}
            {activeCategory === 'accounts' && <AccountsSettings />}
            {activeCategory === 'updates' && <UpdateSettings />}
            {activeCategory === 'display' && <DisplaySoundSettings />}
            {activeCategory === 'time' && <TimeLanguageSettings />}
            {activeCategory === 'advanced' && <AdvancedSettings />}
          </div>
        </div>
      </div>
    </Window>
  );
};
