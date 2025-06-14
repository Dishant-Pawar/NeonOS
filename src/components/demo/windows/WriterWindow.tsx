
import React, { useState } from 'react';
import { Window } from '../Window';
import { Bold, Italic, Underline, Save, FileText, Printer } from 'lucide-react';

interface WriterWindowProps {
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  zIndex: number;
}

export const WriterWindow = ({ onClose, onMinimize, onMaximize, zIndex }: WriterWindowProps) => {
  const [content, setContent] = useState('Welcome to LibreOffice Writer!\n\nStart typing your document here...');
  const [fontSize, setFontSize] = useState(12);

  return (
    <Window
      title="LibreOffice Writer"
      onClose={onClose}
      onMinimize={onMinimize}
      onMaximize={onMaximize}
      zIndex={zIndex}
      initialSize={{ width: 900, height: 700 }}
    >
      <div className="flex flex-col h-full bg-white">
        {/* Toolbar */}
        <div className="border-b border-gray-200 p-2 flex items-center gap-2 bg-gray-50">
          <button className="p-2 hover:bg-gray-200 rounded">
            <Save className="w-4 h-4" />
          </button>
          <button className="p-2 hover:bg-gray-200 rounded">
            <Printer className="w-4 h-4" />
          </button>
          <div className="border-l border-gray-300 h-6 mx-2" />
          <button className="p-2 hover:bg-gray-200 rounded">
            <Bold className="w-4 h-4" />
          </button>
          <button className="p-2 hover:bg-gray-200 rounded">
            <Italic className="w-4 h-4" />
          </button>
          <button className="p-2 hover:bg-gray-200 rounded">
            <Underline className="w-4 h-4" />
          </button>
          <select 
            value={fontSize} 
            onChange={(e) => setFontSize(Number(e.target.value))}
            className="border border-gray-300 rounded px-2 py-1"
          >
            <option value={10}>10</option>
            <option value={12}>12</option>
            <option value={14}>14</option>
            <option value={16}>16</option>
            <option value={18}>18</option>
            <option value={24}>24</option>
          </select>
        </div>

        {/* Document Area */}
        <div className="flex-1 p-4 bg-gray-100">
          <div className="bg-white shadow-lg max-w-4xl mx-auto min-h-full p-8">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full h-full resize-none border-none outline-none"
              style={{ fontSize: `${fontSize}px`, lineHeight: '1.6' }}
            />
          </div>
        </div>

        {/* Status Bar */}
        <div className="border-t border-gray-200 p-2 bg-gray-50 text-sm text-gray-600">
          Words: {content.split(/\s+/).filter(word => word.length > 0).length} | 
          Characters: {content.length} | 
          Page 1 of 1
        </div>
      </div>
    </Window>
  );
};
