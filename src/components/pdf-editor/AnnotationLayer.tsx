
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { usePDF } from './PDFContext';
import { Canvas as FabricCanvas, Circle, Rect, Textbox, Path, FabricText, Line, Triangle } from 'fabric';
import { toast } from 'sonner';

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
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [activeColor, setActiveColor] = useState('#ff0000');
  const [strokeWidth, setStrokeWidth] = useState(2);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new FabricCanvas(canvasRef.current, {
      width: width,
      height: width * 1.414, // A4 aspect ratio
      backgroundColor: 'transparent',
      selection: state.selectedTool === 'select',
      preserveObjectStacking: true
    });

    // Configure drawing mode
    canvas.isDrawingMode = state.selectedTool === 'pen';
    if (canvas.freeDrawingBrush) {
      canvas.freeDrawingBrush.color = activeColor;
      canvas.freeDrawingBrush.width = strokeWidth;
    }

    setFabricCanvas(canvas);

    return () => {
      canvas.dispose();
    };
  }, [width, state.selectedTool, activeColor, strokeWidth]);

  useEffect(() => {
    if (!fabricCanvas) return;

    const handleMouseDown = (e: any) => {
      const pointer = fabricCanvas.getPointer(e.e);
      setStartX(pointer.x);
      setStartY(pointer.y);

      if (state.selectedTool === 'text') {
        const textbox = new Textbox('Click to edit text', {
          left: pointer.x,
          top: pointer.y,
          width: 200,
          fontSize: 16,
          fontFamily: 'Arial',
          fill: activeColor,
          editable: true,
          splitByGrapheme: true
        });
        fabricCanvas.add(textbox);
        fabricCanvas.setActiveObject(textbox);
        textbox.enterEditing();
        fabricCanvas.renderAll();
      } else if (state.selectedTool === 'rectangle') {
        setIsDrawing(true);
      } else if (state.selectedTool === 'circle') {
        setIsDrawing(true);
      } else if (state.selectedTool === 'highlight') {
        const rect = new Rect({
          left: pointer.x,
          top: pointer.y,
          width: 100,
          height: 20,
          fill: 'rgba(255, 255, 0, 0.3)',
          stroke: 'rgba(255, 255, 0, 0.6)',
          strokeWidth: 1,
          selectable: true
        });
        fabricCanvas.add(rect);
        fabricCanvas.renderAll();
      }
    };

    const handleMouseMove = (e: any) => {
      if (!isDrawing) return;
      
      const pointer = fabricCanvas.getPointer(e.e);
      const objects = fabricCanvas.getObjects();
      const lastObject = objects[objects.length - 1];

      if (state.selectedTool === 'rectangle' && lastObject instanceof Rect) {
        const width = pointer.x - startX;
        const height = pointer.y - startY;
        lastObject.set({
          width: Math.abs(width),
          height: Math.abs(height),
          left: width > 0 ? startX : pointer.x,
          top: height > 0 ? startY : pointer.y
        });
        fabricCanvas.renderAll();
      } else if (state.selectedTool === 'circle' && lastObject instanceof Circle) {
        const radius = Math.sqrt(Math.pow(pointer.x - startX, 2) + Math.pow(pointer.y - startY, 2)) / 2;
        lastObject.set({
          radius: radius,
          left: startX - radius,
          top: startY - radius
        });
        fabricCanvas.renderAll();
      }
    };

    const handleMouseUp = () => {
      if (isDrawing) {
        if (state.selectedTool === 'rectangle') {
          const rect = new Rect({
            left: startX,
            top: startY,
            width: 100,
            height: 60,
            fill: 'rgba(255, 0, 0, 0.1)',
            stroke: activeColor,
            strokeWidth: strokeWidth,
            selectable: true
          });
          fabricCanvas.add(rect);
        } else if (state.selectedTool === 'circle') {
          const circle = new Circle({
            left: startX,
            top: startY,
            radius: 30,
            fill: 'rgba(0, 255, 0, 0.1)',
            stroke: activeColor,
            strokeWidth: strokeWidth,
            selectable: true
          });
          fabricCanvas.add(circle);
        }
        fabricCanvas.renderAll();
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

    const handleObjectModified = () => {
      toast.success('Annotation updated');
    };

    fabricCanvas.on('mouse:down', handleMouseDown);
    fabricCanvas.on('mouse:move', handleMouseMove);
    fabricCanvas.on('mouse:up', handleMouseUp);
    fabricCanvas.on('object:added', handleObjectAdded);
    fabricCanvas.on('object:modified', handleObjectModified);

    return () => {
      fabricCanvas.off('mouse:down', handleMouseDown);
      fabricCanvas.off('mouse:move', handleMouseMove);
      fabricCanvas.off('mouse:up', handleMouseUp);
      fabricCanvas.off('object:added', handleObjectAdded);
      fabricCanvas.off('object:modified', handleObjectModified);
    };
  }, [fabricCanvas, state.selectedTool, pageNumber, addAnnotation, isDrawing, startX, startY, activeColor, strokeWidth]);

  const handleKeyDown = useCallback(async (e: KeyboardEvent) => {
    if (!fabricCanvas) return;

    if (e.key === 'Delete' || e.key === 'Backspace') {
      const activeObject = fabricCanvas.getActiveObject();
      if (activeObject) {
        fabricCanvas.remove(activeObject);
        fabricCanvas.renderAll();
        toast.success('Annotation deleted');
      }
    } else if (e.ctrlKey || e.metaKey) {
      if (e.key === 'z') {
        // Undo functionality
        e.preventDefault();
        const objects = fabricCanvas.getObjects();
        if (objects.length > 0) {
          fabricCanvas.remove(objects[objects.length - 1]);
          fabricCanvas.renderAll();
          toast.success('Undone');
        }
      } else if (e.key === 'c') {
        // Copy functionality
        e.preventDefault();
        const activeObject = fabricCanvas.getActiveObject();
        if (activeObject) {
          try {
            const cloned = await activeObject.clone();
            fabricCanvas.discardActiveObject();
            cloned.set({
              left: cloned.left + 10,
              top: cloned.top + 10,
              evented: true,
            });
            fabricCanvas.add(cloned);
            fabricCanvas.setActiveObject(cloned);
            fabricCanvas.renderAll();
            toast.success('Annotation copied');
          } catch (error) {
            console.error('Error copying object:', error);
            toast.error('Failed to copy annotation');
          }
        }
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
        className="pointer-events-auto cursor-crosshair"
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
