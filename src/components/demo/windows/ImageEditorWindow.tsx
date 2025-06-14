
import React, { useState } from 'react';
import { Window } from '../Window';
import { Brush, Eraser, Type, Square, Circle, Save, Undo, Redo } from 'lucide-react';

interface ImageEditorWindowProps {
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  zIndex: number;
}

export const ImageEditorWindow = ({ onClose, onMinimize, onMaximize, zIndex }: ImageEditorWindowProps) => {
  const [selectedTool, setSelectedTool] = useState('brush');
  const [brushSize, setBrushSize] = useState(5);
  const [brushColor, setBrushColor] = useState('#000000');

  const tools = [
    { id: 'brush', icon: Brush, name: 'Brush' },
    { id: 'eraser', icon: Eraser, name: 'Eraser' },
    { id: 'text', icon: Type, name: 'Text' },
    { id: 'rectangle', icon: Square, name: 'Rectangle' },
    { id: 'circle', icon: Circle, name: 'Circle' },
  ];

  return (
    <Window
      title="GIMP - Image Editor"
      onClose={onClose}
      onMinimize={onMinimize}
      onMaximize={onMaximize}
      zIndex={zIndex}
      initialSize={{ width: 1000, height: 700 }}
    >
      <div className="flex h-full">
        {/* Toolbox */}
        <div className="w-20 bg-gray-800 p-2 flex flex-col gap-2">
          {tools.map((tool) => (
            <button
              key={tool.id}
              onClick={() => setSelectedTool(tool.id)}
              className={`p-3 rounded hover:bg-gray-700 ${
                selectedTool === tool.id ? 'bg-blue-600' : 'bg-gray-700'
              }`}
              title={tool.name}
            >
              <tool.icon className="w-5 h-5 text-white" />
            </button>
          ))}
        </div>

        {/* Main Canvas Area */}
        <div className="flex-1 flex flex-col">
          {/* Top Toolbar */}
          <div className="border-b border-gray-200 p-2 flex items-center gap-2 bg-gray-50">
            <button className="p-2 hover:bg-gray-200 rounded">
              <Undo className="w-4 h-4" />
            </button>
            <button className="p-2 hover:bg-gray-200 rounded">
              <Redo className="w-4 h-4" />
            </button>
            <div className="border-l border-gray-300 h-6 mx-2" />
            <button className="p-2 hover:bg-gray-200 rounded">
              <Save className="w-4 h-4" />
            </button>
            <div className="border-l border-gray-300 h-6 mx-2" />
            <div className="flex items-center gap-2">
              <label className="text-sm">Size:</label>
              <input
                type="range"
                min="1"
                max="50"
                value={brushSize}
                onChange={(e) => setBrushSize(Number(e.target.value))}
                className="w-20"
              />
              <span className="text-sm w-6">{brushSize}</span>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm">Color:</label>
              <input
                type="color"
                value={brushColor}
                onChange={(e) => setBrushColor(e.target.value)}
                className="w-8 h-8 rounded border"
              />
            </div>
          </div>

          {/* Canvas */}
          <div className="flex-1 bg-gray-200 p-4 overflow-auto">
            <div className="bg-white border-2 border-gray-300 mx-auto" style={{ width: '800px', height: '600px' }}>
              <div className="w-full h-full bg-white relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    <div className="text-6xl mb-4">🎨</div>
                    <p>Canvas Ready</p>
                    <p className="text-sm">Select a tool and start creating!</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-64 bg-gray-50 border-l border-gray-200 p-4">
          <div className="mb-6">
            <h3 className="font-semibold mb-3">Layers</h3>
            <div className="space-y-2">
              <div className="bg-blue-100 border border-blue-300 p-2 rounded text-sm">
                Layer 1 (Active)
              </div>
              <div className="bg-white border border-gray-300 p-2 rounded text-sm">
                Background
              </div>
            </div>
            <button className="mt-2 text-sm text-blue-600 hover:text-blue-800">
              + Add Layer
            </button>
          </div>

          <div className="mb-6">
            <h3 className="font-semibold mb-3">Properties</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">Opacity</label>
                <input type="range" min="0" max="100" defaultValue="100" className="w-full" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Blend Mode</label>
                <select className="w-full p-1 border border-gray-300 rounded text-sm">
                  <option>Normal</option>
                  <option>Multiply</option>
                  <option>Screen</option>
                  <option>Overlay</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Filters</h3>
            <div className="space-y-2">
              <button className="w-full text-left p-2 text-sm hover:bg-gray-100 rounded">
                Blur
              </button>
              <button className="w-full text-left p-2 text-sm hover:bg-gray-100 rounded">
                Sharpen
              </button>
              <button className="w-full text-left p-2 text-sm hover:bg-gray-100 rounded">
                Emboss
              </button>
            </div>
          </div>
        </div>
      </div>
    </Window>
  );
};
