
import React from 'react';
import { X, Wifi, Bluetooth, Plane, Volume2 } from 'lucide-react';
import { useDemoContext } from './DemoContext';

interface SystemPanelProps {
  onClose: () => void;
}

export const SystemPanel = ({ onClose }: SystemPanelProps) => {
  const { systemSettings, updateSystemSettings } = useDemoContext();

  const handleWifiToggle = () => {
    updateSystemSettings({ wifi: !systemSettings.wifi });
  };

  const handleBluetoothToggle = () => {
    updateSystemSettings({ bluetooth: !systemSettings.bluetooth });
  };

  const handleAirplaneModeToggle = () => {
    updateSystemSettings({ 
      airplaneMode: !systemSettings.airplaneMode,
      wifi: systemSettings.airplaneMode ? systemSettings.wifi : false,
      bluetooth: systemSettings.airplaneMode ? systemSettings.bluetooth : false
    });
  };

  const handleVolumeChange = (volume: number) => {
    updateSystemSettings({ volume });
  };

  return (
    <div className="absolute top-8 right-4 w-80 bg-white/95 backdrop-blur-md rounded-lg shadow-xl border border-gray-200 z-50">
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h3 className="font-semibold text-gray-800">System Controls</h3>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      
      <div className="p-4 space-y-4">
        {/* WiFi Control */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Wifi className={`w-5 h-5 ${systemSettings.wifi ? 'text-green-500' : 'text-gray-400'}`} />
            <span className="text-gray-700">WiFi</span>
          </div>
          <button
            onClick={handleWifiToggle}
            className={`w-12 h-6 rounded-full transition-colors ${
              systemSettings.wifi ? 'bg-blue-500' : 'bg-gray-300'
            }`}
            disabled={systemSettings.airplaneMode}
          >
            <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
              systemSettings.wifi ? 'translate-x-6' : 'translate-x-1'
            }`} />
          </button>
        </div>

        {/* Bluetooth Control */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Bluetooth className={`w-5 h-5 ${systemSettings.bluetooth ? 'text-blue-500' : 'text-gray-400'}`} />
            <span className="text-gray-700">Bluetooth</span>
          </div>
          <button
            onClick={handleBluetoothToggle}
            className={`w-12 h-6 rounded-full transition-colors ${
              systemSettings.bluetooth ? 'bg-blue-500' : 'bg-gray-300'
            }`}
            disabled={systemSettings.airplaneMode}
          >
            <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
              systemSettings.bluetooth ? 'translate-x-6' : 'translate-x-1'
            }`} />
          </button>
        </div>

        {/* Airplane Mode */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Plane className={`w-5 h-5 ${systemSettings.airplaneMode ? 'text-orange-500' : 'text-gray-400'}`} />
            <span className="text-gray-700">Airplane Mode</span>
          </div>
          <button
            onClick={handleAirplaneModeToggle}
            className={`w-12 h-6 rounded-full transition-colors ${
              systemSettings.airplaneMode ? 'bg-orange-500' : 'bg-gray-300'
            }`}
          >
            <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
              systemSettings.airplaneMode ? 'translate-x-6' : 'translate-x-1'
            }`} />
          </button>
        </div>

        {/* Volume Control */}
        <div className="space-y-2">
          <div className="flex items-center space-x-3">
            <Volume2 className="w-5 h-5 text-gray-600" />
            <span className="text-gray-700">Volume</span>
            <span className="text-sm text-gray-500">{systemSettings.volume}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={systemSettings.volume}
            onChange={(e) => handleVolumeChange(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};
