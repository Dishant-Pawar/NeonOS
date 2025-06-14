
import React, { useEffect, useState } from 'react';

interface BootScreenProps {
  onBootComplete: () => void;
}

export const BootScreen = ({ onBootComplete }: BootScreenProps) => {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('Initializing...');

  const bootSteps = [
    'Initializing RAVAN Kernel...',
    'Loading system modules...',
    'Starting RAVAN Connect...',
    'Initializing AI Assistant...',
    'Loading desktop environment...',
    'Welcome to RAVAN OS!'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 2;
        const stepIndex = Math.floor((newProgress / 100) * bootSteps.length);
        if (stepIndex < bootSteps.length) {
          setCurrentStep(bootSteps[stepIndex]);
        }
        
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(onBootComplete, 500);
          return 100;
        }
        return newProgress;
      });
    }, 60);

    return () => clearInterval(interval);
  }, [onBootComplete]);

  return (
    <div className="h-screen w-full bg-black flex flex-col items-center justify-center text-white">
      {/* RAVAN Logo */}
      <div className="mb-8 animate-pulse">
        <div className="text-6xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
          RAVAN
        </div>
        <div className="text-center text-sm text-gray-400 mt-2">
          One System. Endless Possibilities.
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-80 bg-gray-700 rounded-full h-2 mb-4">
        <div 
          className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Current Step */}
      <div className="text-sm text-gray-300 animate-fade-in">
        {currentStep}
      </div>

      {/* Loading Animation */}
      <div className="flex space-x-1 mt-4">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
            style={{ animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </div>
    </div>
  );
};
