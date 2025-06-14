
import React, { useState } from 'react';
import { Window } from '../Window';
import { ArrowLeft, ArrowRight, RotateCcw, Home, Star, Shield } from 'lucide-react';

interface BrowserWindowProps {
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  zIndex: number;
}

export const BrowserWindow = ({ onClose, onMinimize, onMaximize, zIndex }: BrowserWindowProps) => {
  const [url, setUrl] = useState('https://ravan-os.com');
  const [currentPage, setCurrentPage] = useState('home');

  const pages = {
    home: {
      title: 'RAVAN OS - Advanced Security Operating System',
      content: (
        <div className="p-8 bg-gradient-to-br from-blue-900 to-purple-900 text-white min-h-full">
          <h1 className="text-4xl font-bold mb-6">Welcome to RAVAN OS</h1>
          <p className="text-xl mb-4">The most secure operating system for cybersecurity professionals.</p>
          <div className="grid grid-cols-3 gap-6 mt-8">
            <div className="bg-white/10 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-2">Advanced Security</h3>
              <p>Built-in antivirus, firewall, and intrusion detection.</p>
            </div>
            <div className="bg-white/10 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-2">Penetration Testing</h3>
              <p>Pre-installed tools for ethical hacking and security assessment.</p>
            </div>
            <div className="bg-white/10 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-2">Privacy First</h3>
              <p>Anonymous browsing and encrypted communications by default.</p>
            </div>
          </div>
        </div>
      )
    },
    search: {
      title: 'DuckDuckGo - Privacy Search Engine',
      content: (
        <div className="p-8 bg-white min-h-full">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-4">DuckDuckGo</h1>
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Search the web without being tracked"
                  className="w-full p-4 border-2 border-gray-300 rounded-full text-lg"
                />
                <button className="absolute right-2 top-2 bg-orange-500 text-white px-6 py-2 rounded-full">
                  Search
                </button>
              </div>
            </div>
            <div className="text-center text-gray-600">
              <p>We don't store your personal information. Ever.</p>
            </div>
          </div>
        </div>
      )
    }
  };

  const navigate = (page: string, newUrl: string) => {
    setCurrentPage(page);
    setUrl(newUrl);
  };

  return (
    <Window
      title="Firefox - Web Browser"
      onClose={onClose}
      onMinimize={onMinimize}
      onMaximize={onMaximize}
      zIndex={zIndex}
      initialSize={{ width: 1000, height: 700 }}
    >
      <div className="flex flex-col h-full">
        {/* Browser Controls */}
        <div className="border-b border-gray-200 p-2 flex items-center gap-2 bg-gray-50">
          <button className="p-2 hover:bg-gray-200 rounded">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <button className="p-2 hover:bg-gray-200 rounded">
            <ArrowRight className="w-4 h-4" />
          </button>
          <button className="p-2 hover:bg-gray-200 rounded">
            <RotateCcw className="w-4 h-4" />
          </button>
          <button 
            onClick={() => navigate('home', 'https://ravan-os.com')}
            className="p-2 hover:bg-gray-200 rounded"
          >
            <Home className="w-4 h-4" />
          </button>
        </div>

        {/* Address Bar */}
        <div className="border-b border-gray-200 p-2 flex items-center gap-2 bg-white">
          <Shield className="w-4 h-4 text-green-500" />
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-1 px-3 py-1 border border-gray-300 rounded"
          />
          <button className="p-2 hover:bg-gray-200 rounded">
            <Star className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Bar */}
        <div className="border-b border-gray-200 bg-gray-100">
          <div className="flex">
            <div 
              className={`px-4 py-2 cursor-pointer ${currentPage === 'home' ? 'bg-white border-t-2 border-blue-500' : 'hover:bg-gray-200'}`}
              onClick={() => navigate('home', 'https://ravan-os.com')}
            >
              RAVAN OS
            </div>
            <div 
              className={`px-4 py-2 cursor-pointer ${currentPage === 'search' ? 'bg-white border-t-2 border-blue-500' : 'hover:bg-gray-200'}`}
              onClick={() => navigate('search', 'https://duckduckgo.com')}
            >
              DuckDuckGo
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-auto">
          {pages[currentPage as keyof typeof pages]?.content}
        </div>
      </div>
    </Window>
  );
};
