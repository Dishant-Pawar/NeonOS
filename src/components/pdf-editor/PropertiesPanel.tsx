
import React from 'react';
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

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
      {/* Panel Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Properties</h2>
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
                <Label htmlFor="tool-opacity" className="text-sm">Opacity</Label>
                <Slider
                  id="tool-opacity"
                  defaultValue={[100]}
                  max={100}
                  step={1}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="stroke-width" className="text-sm">Stroke Width</Label>
                <Input
                  id="stroke-width"
                  type="number"
                  defaultValue="2"
                  min="1"
                  max="20"
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
            
            <div className="grid grid-cols-4 gap-2">
              {['#000000', '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ffffff'].map((color) => (
                <div
                  key={color}
                  className="w-8 h-8 rounded border border-gray-300 cursor-pointer hover:scale-110 transition-transform"
                  style={{ backgroundColor: color }}
                />
              ))}
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
                  <Label htmlFor="font-size" className="text-sm">Font Size</Label>
                  <Input
                    id="font-size"
                    type="number"
                    defaultValue="16"
                    min="8"
                    max="72"
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="font-family" className="text-sm">Font Family</Label>
                  <select className="w-full mt-2 p-2 border border-gray-300 rounded-md text-sm">
                    <option value="Arial">Arial</option>
                    <option value="Times New Roman">Times New Roman</option>
                    <option value="Helvetica">Helvetica</option>
                    <option value="Courier">Courier</option>
                  </select>
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
                <span>{state.totalPages}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Current:</span>
                <span>{state.currentPage}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Zoom:</span>
                <span>{state.zoom}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Modified:</span>
                <span>{state.isModified ? 'Yes' : 'No'}</span>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>

      {/* Panel Footer */}
      <div className="p-4 border-t border-gray-200">
        <Button variant="outline" size="sm" className="w-full">
          Reset Properties
        </Button>
      </div>
    </div>
  );
};
