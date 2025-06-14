
import React, { useState } from 'react';
import { Window } from '../Window';
import { Save, Play, Folder, Search, Settings } from 'lucide-react';

interface CodeEditorWindowProps {
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  zIndex: number;
}

export const CodeEditorWindow = ({ onClose, onMinimize, onMaximize, zIndex }: CodeEditorWindowProps) => {
  const [code, setCode] = useState(`// Welcome to VS Code
function helloWorld() {
    console.log("Hello, RAVAN OS!");
    return "Security-first development environment";
}

// Example security function
function validateInput(input) {
    // Sanitize input to prevent XSS
    return input.replace(/[<>]/g, '');
}

helloWorld();`);

  const [activeTab, setActiveTab] = useState('app.js');
  const tabs = ['app.js', 'security.js', 'README.md'];

  return (
    <Window
      title="Visual Studio Code"
      onClose={onClose}
      onMinimize={onMinimize}
      onMaximize={onMaximize}
      zIndex={zIndex}
      initialSize={{ width: 1000, height: 700 }}
    >
      <div className="flex h-full bg-gray-900 text-white">
        {/* Sidebar */}
        <div className="w-16 bg-gray-800 flex flex-col items-center py-2">
          <button className="p-3 hover:bg-gray-700 rounded mb-2" title="Explorer">
            <Folder className="w-5 h-5" />
          </button>
          <button className="p-3 hover:bg-gray-700 rounded mb-2" title="Search">
            <Search className="w-5 h-5" />
          </button>
          <button className="p-3 hover:bg-gray-700 rounded mb-2" title="Run">
            <Play className="w-5 h-5" />
          </button>
          <button className="p-3 hover:bg-gray-700 rounded" title="Settings">
            <Settings className="w-5 h-5" />
          </button>
        </div>

        {/* File Explorer */}
        <div className="w-64 bg-gray-800 border-r border-gray-700">
          <div className="p-3 border-b border-gray-700">
            <h3 className="text-sm font-semibold">EXPLORER</h3>
          </div>
          <div className="p-2">
            <div className="text-sm text-gray-300 mb-2">RAVAN-PROJECT</div>
            <div className="space-y-1 text-sm">
              <div className="pl-4 py-1 hover:bg-gray-700 cursor-pointer">📄 app.js</div>
              <div className="pl-4 py-1 hover:bg-gray-700 cursor-pointer">🔒 security.js</div>
              <div className="pl-4 py-1 hover:bg-gray-700 cursor-pointer">📋 README.md</div>
              <div className="pl-4 py-1 hover:bg-gray-700 cursor-pointer">📦 package.json</div>
            </div>
          </div>
        </div>

        {/* Editor */}
        <div className="flex-1 flex flex-col">
          {/* Tab Bar */}
          <div className="bg-gray-800 border-b border-gray-700 flex">
            {tabs.map((tab) => (
              <div
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm cursor-pointer border-r border-gray-700 ${
                  activeTab === tab ? 'bg-gray-900 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                {tab}
              </div>
            ))}
          </div>

          {/* Editor Content */}
          <div className="flex-1 flex">
            <div className="flex-1 relative">
              {/* Line Numbers */}
              <div className="absolute left-0 top-0 w-12 bg-gray-800 text-gray-500 text-sm font-mono pt-4">
                {code.split('\n').map((_, i) => (
                  <div key={i} className="text-right pr-2 leading-6">
                    {i + 1}
                  </div>
                ))}
              </div>
              
              {/* Code Area */}
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full h-full bg-gray-900 text-white font-mono text-sm pl-14 p-4 resize-none border-none outline-none leading-6"
                spellCheck={false}
              />
            </div>
          </div>

          {/* Status Bar */}
          <div className="bg-blue-600 text-white text-xs p-1 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span>JavaScript</span>
              <span>UTF-8</span>
              <span>LF</span>
            </div>
            <div className="flex items-center gap-4">
              <span>Ln 1, Col 1</span>
              <span>🔒 RAVAN OS</span>
            </div>
          </div>
        </div>
      </div>
    </Window>
  );
};
