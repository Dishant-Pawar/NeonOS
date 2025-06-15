
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { usePDF } from './PDFContext';
import {
  FileText, Save, Upload, Download, Scissors, Copy, Paste, Undo, Redo,
  ZoomIn, ZoomOut, RotateCw, Edit3, Image, Type, Highlighter, MessageSquare,
  Square, Circle, ArrowRight, Pen, Eraser, Lock, Shield, FileSignature,
  Merge, Split, Compress, Watermark, Settings, Eye, EyeOff, Grid3X3,
  Search, Replace, Bookmark, Link, Header, Footer, Tag, Menu, PanelLeft
} from 'lucide-react';
import { toast } from 'sonner';

interface ToolbarProps {
  onOpenFile: () => void;
  onToggleSidebar: () => void;
  onToggleProperties: () => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  onOpenFile,
  onToggleSidebar,
  onToggleProperties
}) => {
  const { state, savePDF, setSelectedTool, setZoom } = usePDF();
  const [undoStack, setUndoStack] = useState<any[]>([]);
  const [redoStack, setRedoStack] = useState<any[]>([]);

  const tools = [
    { id: 'select', icon: ArrowRight, label: 'Select' },
    { id: 'text', icon: Type, label: 'Add Text' },
    { id: 'image', icon: Image, label: 'Add Image' },
    { id: 'highlight', icon: Highlighter, label: 'Highlight' },
    { id: 'note', icon: MessageSquare, label: 'Add Note' },
    { id: 'rectangle', icon: Square, label: 'Rectangle' },
    { id: 'circle', icon: Circle, label: 'Circle' },
    { id: 'pen', icon: Pen, label: 'Pen' },
    { id: 'eraser', icon: Eraser, label: 'Eraser' }
  ];

  const handleSave = async () => {
    try {
      await savePDF();
      toast.success('PDF saved successfully!');
    } catch (error) {
      toast.error('Error saving PDF');
    }
  };

  const handleZoomIn = () => {
    const newZoom = Math.min(state.zoom + 25, 300);
    setZoom(newZoom);
  };

  const handleZoomOut = () => {
    const newZoom = Math.max(state.zoom - 25, 25);
    setZoom(newZoom);
  };

  const handleUndo = () => {
    if (undoStack.length > 0) {
      const lastAction = undoStack[undoStack.length - 1];
      setRedoStack([...redoStack, lastAction]);
      setUndoStack(undoStack.slice(0, -1));
      // Implement undo logic
      toast.info('Action undone');
    }
  };

  const handleRedo = () => {
    if (redoStack.length > 0) {
      const lastAction = redoStack[redoStack.length - 1];
      setUndoStack([...undoStack, lastAction]);
      setRedoStack(redoStack.slice(0, -1));
      // Implement redo logic
      toast.info('Action redone');
    }
  };

  return (
    <div className="bg-white border-b border-gray-200 p-2">
      <div className="flex items-center space-x-2">
        {/* File Operations */}
        <div className="flex items-center space-x-1">
          <Button variant="ghost" size="sm" onClick={onToggleSidebar}>
            <Menu className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={onOpenFile}>
            <Upload className="w-4 h-4" />
            <span className="ml-1 hidden sm:inline">Open</span>
          </Button>
          <Button variant="ghost" size="sm" onClick={handleSave} disabled={!state.pdfDoc}>
            <Save className="w-4 h-4" />
            <span className="ml-1 hidden sm:inline">Save</span>
          </Button>
          <Button variant="ghost" size="sm">
            <Download className="w-4 h-4" />
            <span className="ml-1 hidden sm:inline">Export</span>
          </Button>
        </div>

        <Separator orientation="vertical" className="h-6" />

        {/* Edit Operations */}
        <div className="flex items-center space-x-1">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleUndo}
            disabled={undoStack.length === 0}
          >
            <Undo className="w-4 h-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleRedo}
            disabled={redoStack.length === 0}
          >
            <Redo className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Copy className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Paste className="w-4 h-4" />
          </Button>
        </div>

        <Separator orientation="vertical" className="h-6" />

        {/* Tools */}
        <div className="flex items-center space-x-1">
          {tools.map((tool) => (
            <Button
              key={tool.id}
              variant={state.selectedTool === tool.id ? "default" : "ghost"}
              size="sm"
              onClick={() => setSelectedTool(tool.id)}
              title={tool.label}
            >
              <tool.icon className="w-4 h-4" />
            </Button>
          ))}
        </div>

        <Separator orientation="vertical" className="h-6" />

        {/* View Controls */}
        <div className="flex items-center space-x-1">
          <Button variant="ghost" size="sm" onClick={handleZoomOut}>
            <ZoomOut className="w-4 h-4" />
          </Button>
          <span className="text-sm font-medium min-w-[60px] text-center">
            {state.zoom}%
          </span>
          <Button variant="ghost" size="sm" onClick={handleZoomIn}>
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <RotateCw className="w-4 h-4" />
          </Button>
        </div>

        <Separator orientation="vertical" className="h-6" />

        {/* Advanced Features */}
        <div className="flex items-center space-x-1">
          <Button variant="ghost" size="sm">
            <Lock className="w-4 h-4" />
            <span className="ml-1 hidden sm:inline">Protect</span>
          </Button>
          <Button variant="ghost" size="sm">
            <FileSignature className="w-4 h-4" />
            <span className="ml-1 hidden sm:inline">Sign</span>
          </Button>
          <Button variant="ghost" size="sm">
            <Compress className="w-4 h-4" />
            <span className="ml-1 hidden sm:inline">Compress</span>
          </Button>
        </div>

        <div className="flex-1" />

        {/* Properties Panel Toggle */}
        <Button variant="ghost" size="sm" onClick={onToggleProperties}>
          <PanelLeft className="w-4 h-4" />
          <span className="ml-1 hidden sm:inline">Properties</span>
        </Button>
      </div>

      {/* Secondary Toolbar */}
      <div className="flex items-center space-x-2 mt-2 pt-2 border-t border-gray-100">
        <div className="flex items-center space-x-1 text-sm text-gray-600">
          <FileText className="w-4 h-4" />
          <span>
            Page {state.currentPage} of {state.totalPages}
          </span>
        </div>

        <div className="flex items-center space-x-1">
          <Button variant="ghost" size="sm">
            <Search className="w-4 h-4" />
            <span className="ml-1">Find</span>
          </Button>
          <Button variant="ghost" size="sm">
            <Replace className="w-4 h-4" />
            <span className="ml-1">Replace</span>
          </Button>
        </div>

        <Separator orientation="vertical" className="h-4" />

        <div className="flex items-center space-x-1">
          <Button variant="ghost" size="sm">
            <Bookmark className="w-4 h-4" />
            <span className="ml-1">Bookmark</span>
          </Button>
          <Button variant="ghost" size="sm">
            <Link className="w-4 h-4" />
            <span className="ml-1">Link</span>
          </Button>
        </div>

        <div className="flex-1" />

        {state.isModified && (
          <div className="flex items-center space-x-2 text-sm text-orange-600">
            <div className="w-2 h-2 bg-orange-500 rounded-full" />
            <span>Modified</span>
          </div>
        )}
      </div>
    </div>
  );
};
