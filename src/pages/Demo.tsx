
import React, { useState, useEffect } from 'react';
import { Desktop } from '../components/demo/Desktop';
import { TopBar } from '../components/demo/TopBar';
import { BootScreen } from '../components/demo/BootScreen';
import { DemoProvider } from '../components/demo/DemoContext';

const Demo = () => {
  const [isBooting, setIsBooting] = useState(true);
  const [showTrialPrompt, setShowTrialPrompt] = useState(false);

  useEffect(() => {
    // Boot animation duration
    const bootTimer = setTimeout(() => {
      setIsBooting(false);
    }, 3000);

    // Trial prompt after 5 minutes
    const trialTimer = setTimeout(() => {
      setShowTrialPrompt(true);
    }, 300000); // 5 minutes

    return () => {
      clearTimeout(bootTimer);
      clearTimeout(trialTimer);
    };
  }, []);

  if (isBooting) {
    return <BootScreen onBootComplete={() => setIsBooting(false)} />;
  }

  return (
    <DemoProvider>
      <div className="h-screen w-full overflow-hidden bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative">
        {/* Desktop Background */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-all duration-300"
          style={{
            backgroundImage: `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080"><defs><radialGradient id="cosmic" cx="50%" cy="50%" r="50%"><stop offset="0%" style="stop-color:%23667eea"/><stop offset="100%" style="stop-color:%23764ba2"/></radialGradient></defs><rect width="100%" height="100%" fill="url(%23cosmic)"/><g opacity="0.3"><circle cx="400" cy="200" r="2" fill="white"/><circle cx="800" cy="400" r="1" fill="white"/><circle cx="1200" cy="300" r="1.5" fill="white"/><circle cx="600" cy="600" r="1" fill="white"/><circle cx="1400" cy="700" r="2" fill="white"/></g></svg>')`
          }}
        />
        
        <TopBar />
        <Desktop />

        {/* Trial Prompt Modal */}
        {showTrialPrompt && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md mx-4 text-center">
              <h3 className="text-xl font-bold mb-4">Enjoying RAVAN OS?</h3>
              <p className="text-gray-600 mb-6">
                This is just a demo! Download the full version to experience all features.
              </p>
              <div className="flex gap-3 justify-center">
                <button 
                  onClick={() => window.location.href = '/'}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Download Full Version
                </button>
                <button 
                  onClick={() => setShowTrialPrompt(false)}
                  className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                >
                  Continue Demo
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DemoProvider>
  );
};

export default Demo;
