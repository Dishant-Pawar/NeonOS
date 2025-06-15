
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { 
  Settings, 
  Palette, 
  Type, 
  Square,
  Circle,
  Pen,
  Image
} from 'lucide-react';
import { usePDF } from './PDFContext';

export const PropertiesPanel: React.FC = () => {
  const { state } = usePDF();
  const [activeColor, setActiveColor] = useState('#ff0000');
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [opacity, setOpacity] = useState(100);
  const [fontSize, setFontSize] = useState(16);
  const [fontFamily, setFontFamily] = useState('Arial');

  const colors = [
    '#000000', '#ff0000', '#00ff00', '#0000ff', 
    '#ffff00', '#ff00ff', '#00ffff', '#ffffff',
    '#808080', '#800000', '#008000', '#000080',
    '#808000', '#800080', '#008080', '#c0c0c0'
  ];

  const handleColorChange = (color: string) => {
    setActiveColor(color);
  };

  const handleStrokeWidthChange = (value: number[]) => {
    setStrokeWidth(value[0]);
  };

  const handleOpacityChange = (value: number[]) => {
    setOpacity(value[0]);
  };

  const handleFontSizeChange = (value: string) => {
    const size = parseInt(value);
    if (size >= 8 && size <= 72) {
      setFontSize(size);
    }
  };

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
      {/* Panel Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Properties</h2>
        <p className="text-sm text-gray-500">
          {state.selectedTool === 'select' ? 'Selection Mode' : `${state.selectedTool} Tool`}
        </p>
      </div>

      {/* Content Area */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {/* Tool Properties */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-700 flex items-center">
              <Settings className="w-4 h-4 mr-2" />
              Tool Settings
            </h3>
            
            <div className="space-y-3">
              <div>
                <Label htmlFor="tool-opacity" className="text-sm">Opacity: {opacity}%</Label>
                <Slider
                  id="tool-opacity"
                  value={[opacity]}
                  onValueChange={handleOpacityChange}
                  max={100}
                  step={1}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="stroke-width" className="text-sm">Stroke Width: {strokeWidth}px</Label>
                <Slider
                  id="stroke-width"
                  value={[strokeWidth]}
                  onValueChange={handleStrokeWidthChange}
                  min={1}
                  max={20}
                  step={1}
                  className="mt-2"
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Color Properties */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-700 flex items-center">
              <Palette className="w-4 h-4 mr-2" />
              Colors
            </h3>
            
            <div className="space-y-3">
              <div>
                <Label className="text-sm">Selected Color</Label>
                <div className="flex items-center mt-2 space-x-2">
                  <div
                    className="w-8 h-8 rounded border border-gray-300"
                    style={{ backgroundColor: activeColor }}
                  />
                  <Input
                    type="color"
                    value={activeColor}
                    onChange={(e) => handleColorChange(e.target.value)}
                    className="w-16 h-8 p-0 border-0"
                  />
                  <span className="text-sm text-gray-600">{activeColor}</span>
                </div>
              </div>

              <div>
                <Label className="text-sm">Color Palette</Label>
                <div className="grid grid-cols-4 gap-2 mt-2">
                  {colors.map((color) => (
                    <button
                      key={color}
                      className={`w-8 h-8 rounded border-2 cursor-pointer hover:scale-110 transition-transform ${
                        activeColor === color ? 'border-blue-500' : 'border-gray-300'
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => handleColorChange(color)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Text Properties */}
          {state.selectedTool === 'text' && (
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-700 flex items-center">
                <Type className="w-4 h-4 mr-2" />
                Text Properties
              </h3>
              
              <div className="space-y-3">
                <div>
                  <Label htmlFor="font-size" className="text-sm">Font Size: {fontSize}px</Label>
                  <Input
                    id="font-size"
                    type="number"
                    value={fontSize}
                    onChange={(e) => handleFontSizeChange(e.target.value)}
                    min="8"
                    max="72"
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="font-family" className="text-sm">Font Family</Label>
                  <select 
                    className="w-full mt-2 p-2 border border-gray-300 rounded-md text-sm"
                    value={fontFamily}
                    onChange={(e) => setFontFamily(e.target.value)}
                  >
                    <option value="Arial">Arial</option>
                    <option value="Times New Roman">Times New Roman</option>
                    <option value="Helvetica">Helvetica</option>
                    <option value="Courier">Courier</option>
                    <option value="Georgia">Georgia</option>
                    <option value="Verdana">Verdana</option>
                  </select>
                </div>

                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <strong>B</strong>
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <em>I</em>
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <u>U</u>
                  </Button>
                </div>
              </div>
            </div>
          )}

          <Separator />

          {/* Document Properties */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-700">Document Info</h3>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Pages:</span>
                <span className="font-medium">{state.totalPages}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Current:</span>
                <span className="font-medium">{state.currentPage}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Zoom:</span>
                <span className="font-medium">{state.zoom}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tool:</span>
                <span className="font-medium capitalize">{state.selectedTool}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Modified:</span>
                <span className={`font-medium ${state.isModified ? 'text-orange-600' : 'text-green-600'}`}>
                  {state.isModified ? 'Yes' : 'No'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Annotations:</span>
                <span className="font-medium">{state.annotations.length}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Quick Actions */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-700">Quick Actions</h3>
            
            <div className="space-y-2">
              <Button variant="outline" size="sm" className="w-full">
                Clear All Annotations
              </Button>
              <Button variant="outline" size="sm" className="w-full">
                Export Annotations
              </Button>
              <Button variant="outline" size="sm" className="w-full">
                Import Annotations
              </Button>
            </div>
          </div>
        </div>
      </ScrollArea>

      {/* Panel Footer */}
      <div className="p-4 border-t border-gray-200">
        <Button variant="outline" size="sm" className="w-full">
          Reset All Properties
        </Button>
      </div>
    </div>
  );
};
