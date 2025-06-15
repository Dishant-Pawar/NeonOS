
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { ColorPicker } from './ColorPicker';
import { usePDF } from './PDFContext';
import {
  Type, Palette, AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Bold, Italic, Underline, Settings, Eye, Lock, Unlock,
  RotateCw, Move, Square, Circle, Image, FileText
} from 'lucide-react';

export const PropertiesPanel: React.FC = () => {
  const { state } = usePDF();
  const [selectedElement, setSelectedElement] = useState<any>(null);
  const [textProperties, setTextProperties] = useState({
    fontFamily: 'Arial',
    fontSize: 12,
    fontWeight: 'normal',
    fontStyle: 'normal',
    textDecoration: 'none',
    color: '#000000',
    alignment: 'left',
    opacity: 100
  });

  const [shapeProperties, setShapeProperties] = useState({
    fillColor: '#ffffff',
    borderColor: '#000000',
    borderWidth: 1,
    opacity: 100,
    rotation: 0
  });

  const fontFamilies = [
    'Arial', 'Helvetica', 'Times New Roman', 'Courier New', 
    'Georgia', 'Verdana', 'Tahoma', 'Trebuchet MS'
  ];

  const fontSizes = [8, 9, 10, 11, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48, 60, 72];

  const handleTextPropertyChange = (property: string, value: any) => {
    setTextProperties(prev => ({ ...prev, [property]: value }));
    // Apply changes to selected element
    if (selectedElement) {
      // Implementation would go here
    }
  };

  const handleShapePropertyChange = (property: string, value: any) => {
    setShapeProperties(prev => ({ ...prev, [property]: value }));
    // Apply changes to selected element
    if (selectedElement) {
      // Implementation would go here
    }
  };

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Properties</h2>
      </div>

      <Tabs defaultValue="format" className="flex-1 flex flex-col">
        <TabsList className="mx-4 mt-4 grid w-full grid-cols-3">
          <TabsTrigger value="format">Format</TabsTrigger>
          <TabsTrigger value="layout">Layout</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-auto p-4 space-y-6">
          <TabsContent value="format" className="m-0 space-y-6">
            {/* Text Formatting */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Type className="w-4 h-4" />
                <h3 className="text-sm font-medium">Text Formatting</h3>
              </div>

              <div className="space-y-3">
                <div>
                  <Label htmlFor="font-family" className="text-xs text-gray-600">Font Family</Label>
                  <Select 
                    value={textProperties.fontFamily} 
                    onValueChange={(value) => handleTextPropertyChange('fontFamily', value)}
                  >
                    <SelectTrigger className="w-full mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {fontFamilies.map((font) => (
                        <SelectItem key={font} value={font}>{font}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="font-size" className="text-xs text-gray-600">Font Size</Label>
                  <Select 
                    value={textProperties.fontSize.toString()} 
                    onValueChange={(value) => handleTextPropertyChange('fontSize', parseInt(value))}
                  >
                    <SelectTrigger className="w-full mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {fontSizes.map((size) => (
                        <SelectItem key={size} value={size.toString()}>{size}px</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-xs text-gray-600">Style</Label>
                  <div className="flex space-x-1 mt-1">
                    <Button
                      variant={textProperties.fontWeight === 'bold' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleTextPropertyChange('fontWeight', 
                        textProperties.fontWeight === 'bold' ? 'normal' : 'bold'
                      )}
                    >
                      <Bold className="w-4 h-4" />
                    </Button>
                    <Button
                      variant={textProperties.fontStyle === 'italic' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleTextPropertyChange('fontStyle', 
                        textProperties.fontStyle === 'italic' ? 'normal' : 'italic'
                      )}
                    >
                      <Italic className="w-4 h-4" />
                    </Button>
                    <Button
                      variant={textProperties.textDecoration === 'underline' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleTextPropertyChange('textDecoration', 
                        textProperties.textDecoration === 'underline' ? 'none' : 'underline'
                      )}
                    >
                      <Underline className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <Label className="text-xs text-gray-600">Alignment</Label>
                  <div className="flex space-x-1 mt-1">
                    {[
                      { value: 'left', icon: AlignLeft },
                      { value: 'center', icon: AlignCenter },
                      { value: 'right', icon: AlignRight },
                      { value: 'justify', icon: AlignJustify }
                    ].map(({ value, icon: Icon }) => (
                      <Button
                        key={value}
                        variant={textProperties.alignment === value ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handleTextPropertyChange('alignment', value)}
                      >
                        <Icon className="w-4 h-4" />
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-xs text-gray-600">Text Color</Label>
                  <ColorPicker
                    color={textProperties.color}
                    onChange={(color) => handleTextPropertyChange('color', color)}
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Shape Formatting */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Square className="w-4 h-4" />
                <h3 className="text-sm font-medium">Shape Formatting</h3>
              </div>

              <div className="space-y-3">
                <div>
                  <Label className="text-xs text-gray-600">Fill Color</Label>
                  <ColorPicker
                    color={shapeProperties.fillColor}
                    onChange={(color) => handleShapePropertyChange('fillColor', color)}
                  />
                </div>

                <div>
                  <Label className="text-xs text-gray-600">Border Color</Label>
                  <ColorPicker
                    color={shapeProperties.borderColor}
                    onChange={(color) => handleShapePropertyChange('borderColor', color)}
                  />
                </div>

                <div>
                  <Label htmlFor="border-width" className="text-xs text-gray-600">Border Width</Label>
                  <div className="flex items-center space-x-2 mt-1">
                    <Slider
                      value={[shapeProperties.borderWidth]}
                      onValueChange={([value]) => handleShapePropertyChange('borderWidth', value)}
                      max={10}
                      min={0}
                      step={1}
                      className="flex-1"
                    />
                    <span className="text-xs text-gray-500 w-8">{shapeProperties.borderWidth}px</span>
                  </div>
                </div>

                <div>
                  <Label htmlFor="rotation" className="text-xs text-gray-600">Rotation</Label>
                  <div className="flex items-center space-x-2 mt-1">
                    <Slider
                      value={[shapeProperties.rotation]}
                      onValueChange={([value]) => handleShapePropertyChange('rotation', value)}
                      max={360}
                      min={0}
                      step={1}
                      className="flex-1"
                    />
                    <span className="text-xs text-gray-500 w-12">{shapeProperties.rotation}°</span>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Opacity */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Eye className="w-4 h-4" />
                <h3 className="text-sm font-medium">Transparency</h3>
              </div>

              <div>
                <Label htmlFor="opacity" className="text-xs text-gray-600">Opacity</Label>
                <div className="flex items-center space-x-2 mt-1">
                  <Slider
                    value={[textProperties.opacity]}
                    onValueChange={([value]) => handleTextPropertyChange('opacity', value)}
                    max={100}
                    min={0}
                    step={1}
                    className="flex-1"
                  />
                  <span className="text-xs text-gray-500 w-12">{textProperties.opacity}%</span>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="layout" className="m-0 space-y-6">
            {/* Position and Size */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Move className="w-4 h-4" />
                <h3 className="text-sm font-medium">Position & Size</h3>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="x-position" className="text-xs text-gray-600">X Position</Label>
                  <Input
                    id="x-position"
                    type="number"
                    placeholder="0"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="y-position" className="text-xs text-gray-600">Y Position</Label>
                  <Input
                    id="y-position"
                    type="number"
                    placeholder="0"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="width" className="text-xs text-gray-600">Width</Label>
                  <Input
                    id="width"
                    type="number"
                    placeholder="100"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="height" className="text-xs text-gray-600">Height</Label>
                  <Input
                    id="height"
                    type="number"
                    placeholder="100"
                    className="mt-1"
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Layer Management */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Square className="w-4 h-4" />
                <h3 className="text-sm font-medium">Layer Order</h3>
              </div>

              <div className="flex space-x-2">
                <Button variant="outline" size="sm" className="flex-1">
                  Bring Forward
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  Send Back
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="security" className="m-0 space-y-6">
            {/* Document Security */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Lock className="w-4 h-4" />
                <h3 className="text-sm font-medium">Document Security</h3>
              </div>

              <div className="space-y-3">
                <div>
                  <Label htmlFor="password" className="text-xs text-gray-600">Document Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter password"
                    className="mt-1"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="allow-printing" className="rounded" />
                    <Label htmlFor="allow-printing" className="text-xs">Allow Printing</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="allow-copying" className="rounded" />
                    <Label htmlFor="allow-copying" className="text-xs">Allow Copying</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="allow-editing" className="rounded" />
                    <Label htmlFor="allow-editing" className="text-xs">Allow Editing</Label>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Digital Signatures */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4" />
                <h3 className="text-sm font-medium">Digital Signatures</h3>
              </div>

              <Button variant="outline" className="w-full">
                Add Digital Signature
              </Button>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};
