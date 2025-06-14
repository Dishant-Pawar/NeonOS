import React, { useState, useEffect } from 'react';
import { Window } from '../Window';
import { Shield, Play, Pause, CheckCircle, AlertTriangle, Trash2 } from 'lucide-react';
import { useDemoContext } from '../DemoContext';

interface AntivirusWindowProps {
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  zIndex: number;
  isMaximized?: boolean;
}

interface Threat {
  id: string;
  file: string;
  threat: string;
  status: 'detected' | 'cleaning' | 'cleaned' | 'quarantined';
  severity: 'low' | 'medium' | 'high';
}

const mockThreats: Threat[] = [
  { id: '1', file: '/usr/bin/sysfile.exe', threat: 'Virus.Win32.Generic', status: 'detected', severity: 'high' },
  { id: '2', file: '/var/www/html/config.php', threat: 'Trojan.Banker.Zeus', status: 'detected', severity: 'high' },
  { id: '3', file: '/home/user/secret.docx', threat: 'Rootkit.XYZ.Hidden', status: 'detected', severity: 'medium' },
  { id: '4', file: '/tmp/cache/temp.dll', threat: 'Adware.Generic.Popup', status: 'detected', severity: 'low' },
  { id: '5', file: '/system32/drivers/fake.sys', threat: 'Malware.Stealer.Crypto', status: 'detected', severity: 'high' }
];

export const AntivirusWindow = ({ onClose, onMinimize, onMaximize, zIndex, isMaximized }: AntivirusWindowProps) => {
  const { addNotification } = useDemoContext();
  const [scanMode, setScanMode] = useState<'quick' | 'full' | 'custom'>('quick');
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [currentFile, setCurrentFile] = useState('');
  const [threats, setThreats] = useState<Threat[]>([]);
  const [scanComplete, setScanComplete] = useState(false);
  const [threatsFound, setThreatsFound] = useState(0);
  const [animationPhase, setAnimationPhase] = useState<'scanning' | 'cleaning' | 'complete'>('scanning');

  const scanFiles = [
    '/system/kernel.dll',
    '/usr/bin/explorer.exe',
    '/var/log/system.log',
    '/home/user/documents/',
    '/tmp/cache/',
    '/system32/drivers/',
    '/usr/lib/runtime.so',
    '/var/www/html/',
    '/boot/loader.bin',
    '/etc/config.conf'
  ];

  const startScan = () => {
    setIsScanning(true);
    setScanProgress(0);
    setThreats([]);
    setScanComplete(false);
    setThreatsFound(0);
    setAnimationPhase('scanning');

    const scanDuration = scanMode === 'quick' ? 5000 : scanMode === 'full' ? 12000 : 8000;
    const totalFiles = scanMode === 'quick' ? 10 : scanMode === 'full' ? 25 : 15;
    
    let progress = 0;
    let fileIndex = 0;
    const detectedThreats: Threat[] = [];

    const scanInterval = setInterval(() => {
      progress += 100 / totalFiles;
      fileIndex++;
      
      setScanProgress(Math.min(progress, 100));
      setCurrentFile(scanFiles[fileIndex % scanFiles.length]);

      // Randomly detect threats
      if (Math.random() < 0.3 && detectedThreats.length < mockThreats.length) {
        const threat = mockThreats[detectedThreats.length];
        detectedThreats.push(threat);
        setThreats([...detectedThreats]);
        setThreatsFound(detectedThreats.length);
      }

      if (progress >= 100) {
        clearInterval(scanInterval);
        setAnimationPhase('cleaning');
        setTimeout(() => {
          cleanThreats(detectedThreats);
        }, 1000);
      }
    }, scanDuration / totalFiles);
  };

  const cleanThreats = (detectedThreats: Threat[]) => {
    let cleanedCount = 0;
    
    const cleanInterval = setInterval(() => {
      if (cleanedCount < detectedThreats.length) {
        const updatedThreats = detectedThreats.map((threat, index) => ({
          ...threat,
          status: index <= cleanedCount ? 'cleaned' as const : threat.status
        }));
        setThreats(updatedThreats);
        cleanedCount++;
      } else {
        clearInterval(cleanInterval);
        setAnimationPhase('complete');
        setScanComplete(true);
        setIsScanning(false);
        
        addNotification({
          title: 'RO360 Scan Complete',
          message: `${detectedThreats.length} threats detected and cleaned`,
          type: 'info'
        });
      }
    }, 800);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-blue-400';
      default: return 'text-gray-400';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high': return '⚠️';
      case 'medium': return '⚡';
      case 'low': return 'ℹ️';
      default: return '•';
    }
  };

  return (
    <Window
      title="RO360 Antivirus"
      onClose={onClose}
      onMinimize={onMinimize}
      onMaximize={onMaximize}
      zIndex={zIndex}
      initialSize={{ width: 900, height: 700 }}
      isMaximized={isMaximized}
    >
      <div className="h-full bg-gray-900 text-green-400 font-mono overflow-hidden relative">
        {/* Animated background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-br from-green-900/20 to-blue-900/20"></div>
          <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-transparent via-green-500/5 to-transparent"></div>
        </div>

        <div className="relative z-10 p-6 h-full flex flex-col">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="flex items-center justify-center mb-2">
              <Shield className="w-8 h-8 mr-2 text-green-400" />
              <h1 className="text-2xl font-bold animate-pulse">RO360</h1>
            </div>
            <div className="text-sm text-gray-400 animate-pulse">
              NEXT-GEN CYBERSECURITY PROTOCOL ACTIVE
            </div>
          </div>

          {/* Scan Controls */}
          <div className="mb-6">
            <div className="flex gap-4 mb-4">
              <button
                onClick={() => setScanMode('quick')}
                className={`px-4 py-2 rounded border ${scanMode === 'quick' ? 'border-green-400 bg-green-400/20' : 'border-gray-600'} transition-all`}
                disabled={isScanning}
              >
                Quick Scan
              </button>
              <button
                onClick={() => setScanMode('full')}
                className={`px-4 py-2 rounded border ${scanMode === 'full' ? 'border-green-400 bg-green-400/20' : 'border-gray-600'} transition-all`}
                disabled={isScanning}
              >
                Full Scan
              </button>
              <button
                onClick={() => setScanMode('custom')}
                className={`px-4 py-2 rounded border ${scanMode === 'custom' ? 'border-green-400 bg-green-400/20' : 'border-gray-600'} transition-all`}
                disabled={isScanning}
              >
                Custom Scan
              </button>
            </div>

            <button
              onClick={startScan}
              disabled={isScanning}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-6 py-3 rounded flex items-center justify-center gap-2 transition-all"
            >
              {isScanning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              {isScanning ? 'Scanning...' : `Start ${scanMode.charAt(0).toUpperCase() + scanMode.slice(1)} Scan`}
            </button>
          </div>

          {/* Scan Progress */}
          {isScanning && (
            <div className="mb-6">
              <div className="mb-2 text-sm">
                <span className="text-green-400">Scanning:</span> {currentFile}
              </div>
              <div className="w-full bg-gray-800 rounded-full h-3 mb-2 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-green-400 to-blue-400 transition-all duration-300 animate-pulse"
                  style={{ width: `${scanProgress}%` }}
                ></div>
              </div>
              <div className="text-xs text-gray-400">
                Progress: {Math.round(scanProgress)}% | Threats Found: {threatsFound}
              </div>
            </div>
          )}

          {/* Animation Phase Display */}
          {animationPhase === 'cleaning' && (
            <div className="mb-4 text-center">
              <div className="text-yellow-400 animate-pulse text-lg">
                🔧 CLEANING THREATS...
              </div>
            </div>
          )}

          {scanComplete && (
            <div className="mb-4 text-center">
              <div className="text-green-400 text-lg flex items-center justify-center gap-2">
                <CheckCircle className="w-6 h-6" />
                SYSTEM CLEAN - RO360 ACTIVE PROTECTION ON
              </div>
            </div>
          )}

          {/* Threats List */}
          {threats.length > 0 && (
            <div className="flex-1 overflow-auto">
              <h3 className="text-lg mb-3 text-red-400">
                ⚠️ THREATS DETECTED ({threats.length})
              </h3>
              <div className="space-y-2">
                {threats.map((threat) => (
                  <div
                    key={threat.id}
                    className={`p-3 rounded border transition-all ${
                      threat.status === 'cleaned' 
                        ? 'border-green-600 bg-green-900/20' 
                        : 'border-red-600 bg-red-900/20'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span>{getSeverityIcon(threat.severity)}</span>
                          <span className={`${getSeverityColor(threat.severity)} font-bold`}>
                            {threat.threat}
                          </span>
                          {threat.status === 'cleaned' && (
                            <CheckCircle className="w-4 h-4 text-green-400" />
                          )}
                        </div>
                        <div className="text-sm text-gray-400 mt-1">
                          {threat.file}
                        </div>
                      </div>
                      <div className="text-sm">
                        {threat.status === 'cleaned' ? (
                          <span className="text-green-400">CLEANED</span>
                        ) : threat.status === 'cleaning' ? (
                          <span className="text-yellow-400 animate-pulse">CLEANING...</span>
                        ) : (
                          <span className="text-red-400">INFECTED</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Status Bar */}
          <div className="mt-6 pt-4 border-t border-gray-700">
            <div className="flex justify-between text-sm text-gray-400">
              <span>Status: {isScanning ? 'Scanning' : scanComplete ? 'Protected' : 'Ready'}</span>
              <span>Last Scan: {scanComplete ? 'Just now' : 'Never'}</span>
            </div>
          </div>
        </div>
      </div>
    </Window>
  );
};
