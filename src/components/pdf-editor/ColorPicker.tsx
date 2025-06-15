
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Palette } from 'lucide-react';

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({ color, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const predefinedColors = [
    '#000000', '#333333', '#666666', '#999999', '#cccccc', '#ffffff',
    '#ff0000', '#ff6600', '#ffcc00', '#00ff00', '#0066ff', '#6600ff',
    '#ff0066', '#ff6666', '#ffcc66', '#66ff66', '#66ccff', '#cc66ff',
    '#990000', '#993300', '#999900', '#009900', '#003399', '#330099'
  ];

  const handleColorChange = (newColor: string) => {
    onChange(newColor);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full h-10 p-1 mt-1"
        >
          <div className="flex items-center space-x-2">
            <div
              className="w-6 h-6 rounded border border-gray-300"
              style={{ backgroundColor: color }}
            />
            <span className="text-sm">{color}</span>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64" align="start">
        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium">Color Palette</Label>
            <div className="grid grid-cols-6 gap-2 mt-2">
              {predefinedColors.map((presetColor) => (
                <button
                  key={presetColor}
                  className={`w-8 h-8 rounded border-2 transition-all ${
                    color === presetColor ? 'border-gray-400 scale-110' : 'border-gray-200 hover:border-gray-300'
                  }`}
                  style={{ backgroundColor: presetColor }}
                  onClick={() => {
                    handleColorChange(presetColor);
                    setIsOpen(false);
                  }}
                />
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="color-input" className="text-sm font-medium">Custom Color</Label>
            <div className="flex space-x-2 mt-2">
              <Input
                id="color-input"
                type="color"
                value={color}
                onChange={(e) => handleColorChange(e.target.value)}
                className="w-16 h-10 p-1 border rounded"
              />
              <Input
                type="text"
                value={color}
                onChange={(e) => handleColorChange(e.target.value)}
                placeholder="#000000"
                className="flex-1"
              />
            </div>
          </div>

          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={() => setIsOpen(false)}
              className="flex-1"
            >
              Apply
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
