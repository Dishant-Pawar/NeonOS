
import React, { useState, useEffect } from 'react';
import { X, Terminal, Shield, Wifi, Camera, Code, Gamepad2, Music, Settings, Monitor, Smartphone, Zap, Bot } from 'lucide-react';

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
      name: 'Multiple Desktop Layouts',
      description: 'Switch between Windows, macOS, and Linux desktop environments seamlessly',
      icon: Monitor,
      color: 'from-cyan-400 to-blue-600',
      demo: '$ desktop --switch linux --mode hacker'
    },
    {
      id: 'wifi-finder',
      name: 'NEON OS Connect',
      description: 'Sync your Android phone with file transfer and notifications',
      icon: Smartphone,
      color: 'from-blue-400 to-purple-600',
      demo: 'SYNC: android_device_01 | Files: 1,247'
    },
    {
      id: 'snake-game',
      name: 'Gaming Ready',
      description: 'Steam, Proton, Lutris pre-installed with game mode optimization',
      icon: Gamepad2,
      color: 'from-purple-400 to-pink-600',
      demo: 'GPU: RTX Ready | FPS: 144Hz | Mode: ULTRA'
    },
    {
      id: 'antivirus',
      name: 'NEON OS Assist AI',
      description: 'Voice assistant with local LLM for privacy-first productivity',
      icon: Bot,
      color: 'from-green-400 to-cyan-600',
      demo: 'AI: "Task completed successfully" | Privacy: LOCAL'
    },
    {
      id: 'camera',
      name: 'Deep Customization',
      description: 'Accent colors, themes, live wallpapers with motion blur and parallax',
      icon: Settings,
      color: 'from-pink-400 to-purple-600',
      demo: 'THEME: cyber_purple | EFFECTS: motion_blur'
    },
    {
      id: 'code-editor',
      name: 'Performance Optimized',
      description: 'Built on Ubuntu LTS with hardware-accelerated animations',
      icon: Zap,
      color: 'from-yellow-400 to-orange-600',
      demo: 'CPU: 2.1% | RAM: 890MB | SSD: NVMe Ready'
    }
  ];

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 4000);

    const autoClose = setTimeout(() => {
      onClose();
    }, 30000);

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
    <div className={`fixed inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="relative w-full max-w-6xl mx-4 px-8 py-12 overflow-hidden">
        {/* Animated Background Effects */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.4) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
              radial-gradient(circle at 40% 40%, rgba(120, 119, 198, 0.2) 0%, transparent 50%)
            `
          }} />
        </div>

        {/* Floating Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-cyan-400 rounded-full opacity-30 animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`
              }}
            />
          ))}
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-8 right-8 text-white/80 hover:text-white transition-colors z-10"
        >
          <X className="w-8 h-8" />
        </button>

        {/* Header */}
        <div className="text-center mb-12 relative z-10">
          <h1 className="text-5xl font-bold text-white mb-4">Revolutionary Features</h1>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Experience the future of computing with innovative features designed for modern workflows
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
          {features.map((feature, index) => {
            const isActive = index === currentFeature;
            const IconComponent = feature.icon;
            
            return (
              <div
                key={feature.id}
                className={`relative group transition-all duration-500 transform ${
                  isActive 
                    ? 'scale-105 z-20' 
                    : 'scale-100 hover:scale-102'
                }`}
              >
                {/* Feature Card */}
                <div className={`
                  relative p-8 rounded-2xl backdrop-blur-md border transition-all duration-500
                  ${isActive 
                    ? 'bg-gradient-to-br from-purple-500/30 to-blue-600/30 border-purple-400/50 shadow-2xl shadow-purple-500/20' 
                    : 'bg-white/10 border-white/20 hover:bg-white/15 hover:border-white/30'
                  }
                `}>
                  {/* Active Feature Glow */}
                  {isActive && (
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-400/20 to-blue-600/20 blur-xl"></div>
                  )}
                  
                  {/* Icon */}
                  <div className={`
                    w-16 h-16 rounded-xl mb-6 flex items-center justify-center relative
                    bg-gradient-to-br ${feature.color}
                    ${isActive ? 'animate-pulse' : ''}
                  `}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-xl font-bold text-white mb-3">{feature.name}</h3>
                  <p className="text-white/70 text-sm leading-relaxed mb-4">{feature.description}</p>
                  
                  {/* Demo Terminal */}
                  <div className="bg-black/40 rounded-lg p-3 font-mono text-xs border border-cyan-500/30">
                    <div className="flex items-center mb-1">
                      <div className="flex space-x-1 mr-2">
                        <div className="w-1.5 h-1.5 bg-red-400 rounded-full"></div>
                        <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full"></div>
                        <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                      </div>
                      <span className="text-cyan-400 text-xs">NEON OS_TERMINAL</span>
                    </div>
                    <div className="text-cyan-400">
                      <span className="text-cyan-300">root@NEON OS:~$</span> {feature.demo}
                      {isActive && <span className="animate-pulse">|</span>}
                    </div>
                  </div>

                  {/* Launch Button */}
                  <button
                    onClick={() => handleLaunch(feature.id)}
                    className={`
                      mt-4 w-full py-2 px-4 rounded-lg font-medium transition-all duration-200
                      ${isActive 
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-500 hover:to-blue-500' 
                        : 'bg-white/10 text-white/80 hover:bg-white/20 hover:text-white'
                      }
                    `}
                  >
                    {isActive ? 'LAUNCH NOW' : 'Launch'}
                  </button>
                </div>

                {/* Active Feature Highlight */}
                {isActive && (
                  <div className="absolute -inset-2 rounded-3xl bg-gradient-to-r from-purple-600/20 to-blue-600/20 blur-lg -z-10"></div>
                )}
              </div>
            );
          })}
        </div>

        {/* Progress Indicators */}
        <div className="flex justify-center space-x-3 mt-12 relative z-10">
          {features.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentFeature 
                  ? 'bg-gradient-to-r from-purple-400 to-blue-400 scale-125' 
                  : 'bg-white/30 hover:bg-white/50'
              }`}
            />
          ))}
        </div>

        {/* Bottom Actions */}
        <div className="flex gap-6 justify-center mt-12 relative z-10">
          <button
            onClick={() => handleLaunch(currentFeatureData.id)}
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-500 hover:to-blue-500 font-semibold transition-all duration-200 shadow-lg shadow-purple-500/25 text-lg"
          >
            EXPERIENCE {currentFeatureData.name.toUpperCase()}
          </button>
          <button
            onClick={onClose}
            className="px-8 py-4 bg-white/10 text-white rounded-xl hover:bg-white/20 font-semibold transition-all duration-200 border border-white/20 text-lg"
          >
            SKIP DEMO
          </button>
        </div>

        {/* Scan Lines Effect */}
        <div className="absolute inset-0 pointer-events-none opacity-10">
          <div className="absolute top-1/4 left-0 w-full h-px bg-cyan-400 animate-pulse"></div>
          <div className="absolute top-1/2 left-0 w-full h-px bg-purple-400 animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-3/4 left-0 w-full h-px bg-blue-400 animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>
      </div>
    </div>
  );
};
