
import React, { useState, useEffect } from 'react';
import { Desktop } from '../components/demo/Desktop';
import { TopBar } from '../components/demo/TopBar';
import { BootScreen } from '../components/demo/BootScreen';
import { DemoProvider, useDemoContext } from '../components/demo/DemoContext';
import { Moon } from 'lucide-react';

const DemoContent = () => {
  const { powerState, wakeFromSleep } = useDemoContext();
  const [showTrialPrompt, setShowTrialPrompt] = useState(false);

  useEffect(() => {
    // Trial prompt after 5 minutes
    const trialTimer = setTimeout(() => {
      setShowTrialPrompt(true);
    }, 300000); // 5 minutes

    return () => {
      clearTimeout(trialTimer);
    };
  }, []);

  const handleWakeUp = () => {
    wakeFromSleep();
  };

  if (powerState.isSleeping) {
    return (
      <div 
        className="h-screen w-full bg-black flex items-center justify-center cursor-pointer"
        onClick={handleWakeUp}
      >
        <div className="text-center text-white">
          <Moon className="w-16 h-16 mx-auto mb-4 text-blue-400 animate-pulse" />
          <h2 className="text-2xl font-bold mb-2">RAVAN OS</h2>
          <p className="text-gray-400 mb-4">System is sleeping</p>
          <p className="text-sm text-gray-500">Click anywhere to wake up</p>
        </div>
      </div>
    );
  }

  if (powerState.isRestarting) {
    return (
      <div className="h-screen w-full bg-black flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold mb-2">RAVAN OS</h2>
          <p className="text-gray-400">Restarting system...</p>
        </div>
      </div>
    );
  }

  if (powerState.isShuttingDown) {
    return (
      <div className="h-screen w-full bg-black flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-pulse">
            <div className="w-12 h-12 bg-red-500 rounded-full mx-auto mb-4"></div>
          </div>
          <h2 className="text-2xl font-bold mb-2">RAVAN OS</h2>
          <p className="text-gray-400">Shutting down...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full overflow-hidden relative">
      {/* Professional Desktop Background */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(120, 119, 198, 0.1) 0%, transparent 50%),
            linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)
          `
        }}
      />
      
      {/* Subtle Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
      />
      
      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-20 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>
      
      <TopBar />
      <Desktop />

      {/* Professional Trial Prompt Modal */}
      {showTrialPrompt && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white/95 backdrop-blur-md rounded-xl p-8 max-w-md mx-4 text-center shadow-2xl border border-white/20">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-white font-bold text-xl">RO</span>
            </div>
            <h3 className="text-2xl font-bold mb-4 text-gray-800">Enjoying RAVAN OS?</h3>
            <p className="text-gray-600 mb-8 leading-relaxed">
              This is just a demo! Download the full version to experience all features and capabilities.
            </p>
            <div className="flex gap-4 justify-center">
              <button 
                onClick={() => window.location.href = '/'}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 font-medium transition-all duration-200 shadow-lg"
              >
                Download Full Version
              </button>
              <button 
                onClick={() => setShowTrialPrompt(false)}
                className="px-8 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium transition-all duration-200"
              >
                Continue Demo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Demo = () => {
  const [isBooting, setIsBooting] = useState(true);

  useEffect(() => {
    // Boot animation duration
    const bootTimer = setTimeout(() => {
      setIsBooting(false);
    }, 3000);

    return () => {
      clearTimeout(bootTimer);
    };
  }, []);

  if (isBooting) {
    return <BootScreen onBootComplete={() => setIsBooting(false)} />;
  }

  return (
    <DemoProvider>
      <DemoContent />
    </DemoProvider>
  );
};

export default Demo;
