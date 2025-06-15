
import React, { useState, useEffect } from 'react';
import { X, Terminal, Shield, Wifi, Camera, Code, Gamepad2, Music, Settings } from 'lucide-react';

interface Feature {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  demo: string;
}

interface FeatureShowcaseProps {
  onClose: () => void;
  onLaunchApp: (appId: string) => void;
}

export const FeatureShowcase = ({ onClose, onLaunchApp }: FeatureShowcaseProps) => {
  const [currentFeature, setCurrentFeature] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const features: Feature[] = [
    {
      id: 'terminal',
      name: 'Advanced Terminal',
      description: 'Full-featured command line interface with syntax highlighting and autocomplete',
      icon: Terminal,
      color: 'from-green-600 to-green-800',
      demo: '$ sudo apt-get install awesome'
    },
    {
      id: 'antivirus',
      name: 'RO360 Security Suite',
      description: 'Real-time threat detection and system protection with AI-powered scanning',
      icon: Shield,
      color: 'from-red-600 to-red-800',
      demo: 'SCANNING... 0 threats detected'
    },
    {
      id: 'wifi-finder',
      name: 'Network Scanner',
      description: 'Advanced WiFi analysis and network penetration testing tools',
      icon: Wifi,
      color: 'from-blue-600 to-blue-800',
      demo: 'Found 12 networks | WPA2 detected'
    },
    {
      id: 'camera',
      name: 'RAVAN Camera Pro',
      description: 'Professional photography with filters, effects, and AI enhancement',
      icon: Camera,
      color: 'from-pink-600 to-pink-800',
      demo: 'AI Mode: Portrait optimization'
    },
    {
      id: 'code-editor',
      name: 'Code Editor',
      description: 'Full IDE with syntax highlighting, debugging, and Git integration',
      icon: Code,
      color: 'from-purple-600 to-purple-800',
      demo: 'function hack() { return "success"; }'
    },
    {
      id: 'snake-game',
      name: 'Retro Gaming',
      description: 'Classic games collection with modern graphics and leaderboards',
      icon: Gamepad2,
      color: 'from-emerald-600 to-emerald-800',
      demo: 'High Score: 2,840 points'
    }
  ];

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 4000);

    const autoClose = setTimeout(() => {
      onClose();
    }, 30000); // Auto close after 30 seconds

    return () => {
      clearInterval(interval);
      clearTimeout(autoClose);
    };
  }, [features.length, onClose]);

  const handleLaunch = (appId: string) => {
    onLaunchApp(appId);
    onClose();
  };

  const currentFeatureData = features[currentFeature];

  return (
    <div className={`fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="bg-gray-900 border border-green-500/50 rounded-xl p-8 max-w-2xl mx-4 shadow-2xl shadow-green-500/20 relative overflow-hidden">
        {/* Animated Background Grid */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(rgba(34, 197, 94, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(34, 197, 94, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px'
          }} />
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-green-400 hover:text-green-300 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Header */}
        <div className="text-center mb-8 relative z-10">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-700 rounded-lg flex items-center justify-center mr-4">
              <span className="text-white font-bold text-xl">D008</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-green-400 mb-1">LIVE FEATURE SHOWCASE</h1>
              <p className="text-green-300/70 text-sm">SYSTEM CAPABILITIES DEMONSTRATION</p>
            </div>
          </div>
          
          {/* Hacker-style status line */}
          <div className="bg-black/50 rounded px-4 py-2 font-mono text-sm text-green-400 border border-green-500/30">
            <span className="text-green-500">root@d008:~$</span> showcase --features --live
          </div>
        </div>

        {/* Feature Display */}
        <div className="relative z-10">
          <div className="bg-black/40 rounded-lg p-6 border border-green-500/30 mb-6">
            <div className="flex items-center mb-4">
              <div className={`w-16 h-16 bg-gradient-to-br ${currentFeatureData.color} rounded-lg flex items-center justify-center mr-4 shadow-lg`}>
                <currentFeatureData.icon className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-green-400 mb-1">{currentFeatureData.name}</h3>
                <p className="text-green-300/80 text-sm">{currentFeatureData.description}</p>
              </div>
            </div>
            
            {/* Demo Terminal */}
            <div className="bg-black rounded border border-green-500/50 p-3 font-mono text-sm">
              <div className="flex items-center mb-2">
                <div className="flex space-x-1 mr-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
                <span className="text-green-400 text-xs">D008_DEMO_TERMINAL</span>
              </div>
              <div className="text-green-400">
                <span className="text-green-500">system@d008:~$</span> {currentFeatureData.demo}
                <span className="animate-pulse">|</span>
              </div>
            </div>
          </div>

          {/* Progress Indicators */}
          <div className="flex justify-center space-x-2 mb-6">
            {features.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentFeature ? 'bg-green-400' : 'bg-green-800'
                }`}
              />
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => handleLaunch(currentFeatureData.id)}
              className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 font-medium transition-all duration-200 shadow-lg border border-green-500/50"
            >
              LAUNCH {currentFeatureData.name.toUpperCase()}
            </button>
            <button
              onClick={onClose}
              className="px-6 py-3 bg-gray-700 text-green-400 rounded-lg hover:bg-gray-600 font-medium transition-all duration-200 border border-green-500/30"
            >
              SKIP DEMO
            </button>
          </div>
        </div>

        {/* Animated Side Elements */}
        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-green-500 to-transparent"></div>
        <div className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-green-500 to-transparent"></div>
        
        {/* Glitch Effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-0 w-full h-px bg-green-500/50 animate-pulse"></div>
          <div className="absolute bottom-1/4 left-0 w-full h-px bg-green-500/30 animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>
      </div>
    </div>
  );
};
