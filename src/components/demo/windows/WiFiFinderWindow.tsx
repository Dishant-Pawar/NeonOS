
import React, { useState, useEffect, useRef } from 'react';
import { Window } from '../Window';
import { useDemoContext } from '../DemoContext';

interface WiFiFinderWindowProps {
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  zIndex: number;
}

interface WiFiNetwork {
  ssid: string;
  signal: number;
  latency: string;
  security: string;
}

export const WiFiFinderWindow = ({ onClose, onMinimize, onMaximize, zIndex }: WiFiFinderWindowProps) => {
  const [isScanning, setIsScanning] = useState(true);
  const [networks, setNetworks] = useState<WiFiNetwork[]>([]);
  const [selectedNetwork, setSelectedNetwork] = useState<string | null>(null);
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [password, setPassword] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectedNetwork, setConnectedNetwork] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [scanProgress, setScanProgress] = useState(0);
  const [typingIndex, setTypingIndex] = useState(0);
  const { setSystemSettings } = useDemoContext();
  const terminalRef = useRef<HTMLDivElement>(null);

  const mockNetworks: WiFiNetwork[] = [
    { ssid: 'ZOREN_5G', signal: 5, latency: '20ms', security: 'WPA2' },
    { ssid: 'FBI_SURVEILLANCE_VAN_#13', signal: 4, latency: '32ms', security: 'WPA3' },
    { ssid: 'Hackers_Only', signal: 3, latency: '45ms', security: 'WEP' },
    { ssid: 'VirusFreeWifi', signal: 2, latency: '67ms', security: 'Open' },
    { ssid: 'NSA_Headquarters', signal: 1, latency: '150ms', security: 'WPA2' },
    { ssid: 'CoffeeShop_Guest', signal: 4, latency: '28ms', security: 'WPA2' },
    { ssid: 'Totally_Not_Honeypot', signal: 3, latency: '55ms', security: 'Open' },
    { ssid: 'Router_Default_Password', signal: 2, latency: '89ms', security: 'WEP' }
  ];

  useEffect(() => {
    if (isScanning) {
      const scanTimer = setInterval(() => {
        setScanProgress(prev => {
          if (prev >= 100) {
            setIsScanning(false);
            // Randomize and show networks
            const shuffled = [...mockNetworks].sort(() => Math.random() - 0.5).slice(0, 5 + Math.floor(Math.random() * 3));
            setNetworks(shuffled);
            return 100;
          }
          return prev + 5;
        });
      }, 100);

      return () => clearInterval(scanTimer);
    }
  }, [isScanning]);

  useEffect(() => {
    if (!isScanning && networks.length > 0) {
      const typingTimer = setInterval(() => {
        setTypingIndex(prev => {
          if (prev >= networks.length) {
            clearInterval(typingTimer);
            return prev;
          }
          return prev + 1;
        });
      }, 500);

      return () => clearInterval(typingTimer);
    }
  }, [isScanning, networks.length]);

  const getSignalBars = (signal: number) => {
    const bars = '█'.repeat(signal) + '░'.repeat(5 - signal);
    return `[${bars}]`;
  };

  const getProgressBar = (progress: number) => {
    const filled = Math.floor(progress / 5);
    const bar = '█'.repeat(filled) + '▒'.repeat(20 - filled);
    return bar;
  };

  const handleNetworkClick = (ssid: string) => {
    setSelectedNetwork(ssid);
    setShowPasswordPrompt(true);
    setError('');
    setPassword('');
  };

  const handleConnect = async () => {
    if (!password.trim()) {
      setError('ERROR 403: PASSWORD REQUIRED');
      return;
    }

    setIsConnecting(true);
    setError('');

    // Simulate connection delay
    setTimeout(() => {
      setIsConnecting(false);
      setConnectedNetwork(selectedNetwork);
      setShowPasswordPrompt(false);
      setSystemSettings(prev => ({ ...prev, wifi: true, connectedSSID: selectedNetwork }));
    }, 2000);
  };

  const resetScan = () => {
    setIsScanning(true);
    setNetworks([]);
    setTypingIndex(0);
    setScanProgress(0);
    setSelectedNetwork(null);
    setShowPasswordPrompt(false);
    setConnectedNetwork(null);
    setError('');
  };

  return (
    <Window
      title="WiFi Scanner v2.1.0"
      onClose={onClose}
      onMinimize={onMinimize}
      onMaximize={onMaximize}
      zIndex={zIndex}
      initialSize={{ width: 800, height: 600 }}
    >
      <div 
        ref={terminalRef}
        className="h-full bg-black/95 text-green-400 font-mono text-sm p-6 overflow-y-auto relative"
        style={{ fontFamily: '"Fira Code", "Source Code Pro", monospace' }}
      >
        {/* Glitch Background Effect */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="animate-pulse bg-gradient-to-r from-green-500/20 to-blue-500/20 h-full w-full"></div>
        </div>

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-green-300 mb-2 animate-pulse">
            ╔══════════════════════════════════╗
          </h1>
          <h1 className="text-2xl font-bold text-green-300 mb-2 animate-pulse">
            ║    ZOREN WiFi SCANNER ACTIVE     ║
          </h1>
          <h1 className="text-2xl font-bold text-green-300 mb-4 animate-pulse">
            ╚══════════════════════════════════╝
          </h1>
          <div className="text-blue-300 text-xs">
            [SYSTEM] Quantum network interface initialized...
          </div>
          <div className="text-blue-300 text-xs">
            [SYSTEM] Scanning for wireless signals...
          </div>
        </div>

        {/* Scanning Progress */}
        {isScanning && (
          <div className="mb-6">
            <div className="text-yellow-400 mb-2">
              &gt; SCANNING FOR NETWORKS... {getProgressBar(scanProgress)}
            </div>
            <div className="text-xs text-gray-400">
              Progress: {scanProgress}% | Signal strength analyzer active
            </div>
          </div>
        )}

        {/* Networks List */}
        {!isScanning && networks.length > 0 && (
          <div className="mb-6">
            <div className="text-green-300 mb-4">
              &gt; NETWORKS DETECTED: {networks.length}
            </div>
            <div className="space-y-2">
              {networks.slice(0, typingIndex).map((network, index) => (
                <div
                  key={network.ssid}
                  onClick={() => handleNetworkClick(network.ssid)}
                  className="hover:bg-green-900/30 p-2 rounded cursor-pointer transition-all duration-200 border-l-2 border-transparent hover:border-green-400"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <span className="text-cyan-400">{getSignalBars(network.signal)}</span>
                      <span className="text-white font-semibold">{network.ssid}</span>
                      <span className="text-xs text-purple-400 bg-purple-900/30 px-2 py-1 rounded">
                        {network.security}
                      </span>
                    </div>
                    <div className="text-yellow-400 text-xs">
                      ~{network.latency}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {typingIndex >= networks.length && !connectedNetwork && (
              <div className="mt-4 text-green-300">
                &gt; SELECT NETWORK: <span className="animate-ping">▊</span>
              </div>
            )}
          </div>
        )}

        {/* Password Prompt */}
        {showPasswordPrompt && (
          <div className="mb-6 border border-green-400 p-4 rounded bg-green-900/10">
            <div className="text-yellow-400 mb-2">
              &gt; CONNECTING TO: {selectedNetwork}
            </div>
            <div className="text-white mb-2">Enter password:</div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleConnect()}
              className="bg-black border border-green-400 text-green-400 p-2 w-full rounded font-mono focus:outline-none focus:border-green-300"
              placeholder="password_here"
              autoFocus
            />
            {error && (
              <div className="text-red-400 mt-2 animate-pulse">
                {error}
              </div>
            )}
            {isConnecting && (
              <div className="text-yellow-400 mt-2">
                &gt; AUTHENTICATING... <span className="animate-spin">⚡</span>
              </div>
            )}
            <div className="flex space-x-2 mt-3">
              <button
                onClick={handleConnect}
                disabled={isConnecting}
                className="bg-green-700 hover:bg-green-600 text-white px-4 py-1 rounded text-xs disabled:opacity-50"
              >
                CONNECT
              </button>
              <button
                onClick={() => setShowPasswordPrompt(false)}
                className="bg-red-700 hover:bg-red-600 text-white px-4 py-1 rounded text-xs"
              >
                CANCEL
              </button>
            </div>
          </div>
        )}

        {/* Connection Success */}
        {connectedNetwork && (
          <div className="mb-6 border border-green-400 p-4 rounded bg-green-900/20">
            <div className="text-green-300 mb-2">
              ✅ CONNECTION ESTABLISHED
            </div>
            <div className="text-white">
              Connected to: <span className="text-cyan-400">{connectedNetwork}</span>
            </div>
            <div className="text-xs text-gray-400 mt-1">
              IP: 192.168.1.{Math.floor(Math.random() * 254 + 1)} | Gateway: 192.168.1.1
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="mt-8 pt-4 border-t border-green-400/30">
          <button
            onClick={resetScan}
            className="bg-blue-700 hover:bg-blue-600 text-white px-4 py-2 rounded text-xs mr-2"
          >
            RESCAN
          </button>
          <button
            onClick={onClose}
            className="bg-red-700 hover:bg-red-600 text-white px-4 py-2 rounded text-xs"
          >
            EXIT
          </button>
        </div>

        {/* Footer */}
        <div className="absolute bottom-2 right-4 text-xs text-gray-500">
          ZOREN WiFi Module | v2.1.0 | Quantum Enhanced
        </div>
      </div>
    </Window>
  );
};
