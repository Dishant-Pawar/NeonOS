
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { usePDF } from './PDFContext';
import { Canvas as FabricCanvas, Circle, Rect, Textbox, Path } from 'fabric';

interface AnnotationLayerProps {
  pageNumber: number;
  width: number;
  rotation: number;
}

export const AnnotationLayer: React.FC<AnnotationLayerProps> = ({
  pageNumber,
  width,
  rotation
}) => {
  const { state, addAnnotation, setSelectedTool } = usePDF();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new FabricCanvas(canvasRef.current, {
      width: width,
      height: width * 1.414, // A4 aspect ratio
      backgroundColor: 'transparent',
      selection: state.selectedTool === 'select'
    });

    canvas.isDrawingMode = state.selectedTool === 'pen';
    if (canvas.freeDrawingBrush) {
      canvas.freeDrawingBrush.color = '#ff0000';
      canvas.freeDrawingBrush.width = 2;
    }

    setFabricCanvas(canvas);

    return () => {
      canvas.dispose();
    };
  }, [width, state.selectedTool]);

  useEffect(() => {
    if (!fabricCanvas) return;

    const handleMouseDown = (e: any) => {
      if (state.selectedTool === 'text') {
        const pointer = fabricCanvas.getPointer(e.e);
        const textbox = new Textbox('Click to edit text', {
          left: pointer.x,
          top: pointer.y,
          width: 200,
          fontSize: 16,
          fontFamily: 'Arial',
          fill: '#000000',
          editable: true
        });
        fabricCanvas.add(textbox);
        fabricCanvas.setActiveObject(textbox);
        textbox.enterEditing();
      } else if (state.selectedTool === 'rectangle') {
        const pointer = fabricCanvas.getPointer(e.e);
        const rect = new Rect({
          left: pointer.x,
          top: pointer.y,
          width: 100,
          height: 60,
          fill: 'rgba(255, 0, 0, 0.3)',
          stroke: '#ff0000',
          strokeWidth: 2
        });
        fabricCanvas.add(rect);
      } else if (state.selectedTool === 'circle') {
        const pointer = fabricCanvas.getPointer(e.e);
        const circle = new Circle({
          left: pointer.x,
          top: pointer.y,
          radius: 30,
          fill: 'rgba(0, 255, 0, 0.3)',
          stroke: '#00ff00',
          strokeWidth: 2
        });
        fabricCanvas.add(circle);
      } else if (state.selectedTool === 'highlight') {
        // Highlighting logic would go here
        setIsDrawing(true);
      }
    };

    const handleMouseMove = (e: any) => {
      if (isDrawing && state.selectedTool === 'highlight') {
        // Continue highlighting
      }
    };

    const handleMouseUp = () => {
      if (isDrawing) {
        setIsDrawing(false);
      }
    };

    const handleObjectAdded = (e: any) => {
      const obj = e.target;
      addAnnotation({
        type: state.selectedTool,
        page: pageNumber,
        object: obj,
        data: obj.toObject()
      });
    };

    fabricCanvas.on('mouse:down', handleMouseDown);
    fabricCanvas.on('mouse:move', handleMouseMove);
    fabricCanvas.on('mouse:up', handleMouseUp);
    fabricCanvas.on('object:added', handleObjectAdded);

    return () => {
      fabricCanvas.off('mouse:down', handleMouseDown);
      fabricCanvas.off('mouse:move', handleMouseMove);
      fabricCanvas.off('mouse:up', handleMouseUp);
      fabricCanvas.off('object:added', handleObjectAdded);
    };
  }, [fabricCanvas, state.selectedTool, pageNumber, addAnnotation, isDrawing]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!fabricCanvas) return;

    if (e.key === 'Delete' || e.key === 'Backspace') {
      const activeObject = fabricCanvas.getActiveObject();
      if (activeObject) {
        fabricCanvas.remove(activeObject);
      }
    } else if (e.ctrlKey || e.metaKey) {
      if (e.key === 'z') {
        // Undo functionality
        e.preventDefault();
      } else if (e.key === 'y') {
        // Redo functionality
        e.preventDefault();
      } else if (e.key === 'c') {
        // Copy functionality
        e.preventDefault();
      } else if (e.key === 'v') {
        // Paste functionality
        e.preventDefault();
      }
    }
  }, [fabricCanvas]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <div 
      className="absolute inset-0 pointer-events-none"
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      <canvas
        ref={canvasRef}
        className="pointer-events-auto"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 10
        }}
      />
    </div>
  );
};
