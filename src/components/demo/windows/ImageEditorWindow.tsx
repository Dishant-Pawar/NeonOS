import React, { useState, useRef, useEffect } from 'react';
import { Window } from '../Window';
import { Brush, Eraser, Type, Square, Circle, Save, Undo, Redo, FolderOpen, Plus } from 'lucide-react';

interface ImageEditorWindowProps {
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  zIndex: number;
  isMaximized?: boolean;
}

interface Project {
  id: string;
  name: string;
  canvas: string; // base64 image data
  lastModified: Date;
}

export const ImageEditorWindow = ({ onClose, onMinimize, onMaximize, zIndex, isMaximized }: ImageEditorWindowProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedTool, setSelectedTool] = useState('brush');
  const [brushSize, setBrushSize] = useState(5);
  const [brushColor, setBrushColor] = useState('#000000');
  const [isDrawing, setIsDrawing] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [projectName, setProjectName] = useState('Untitled Project');
  const [showProjects, setShowProjects] = useState(false);
  const [undoStack, setUndoStack] = useState<string[]>([]);
  const [redoStack, setRedoStack] = useState<string[]>([]);

  const tools = [
    { id: 'brush', icon: Brush, name: 'Brush' },
    { id: 'eraser', icon: Eraser, name: 'Eraser' },
    { id: 'rectangle', icon: Square, name: 'Rectangle' },
    { id: 'circle', icon: Circle, name: 'Circle' },
  ];

  useEffect(() => {
    // Load projects from localStorage
    const savedProjects = localStorage.getItem('image-editor-projects');
    if (savedProjects) {
      const parsed = JSON.parse(savedProjects);
      setProjects(parsed.map((project: any) => ({
        ...project,
        lastModified: new Date(project.lastModified)
      })));
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Initialize canvas with white background
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        saveCanvasState();
      }
    }
  }, []);

  const saveCanvasState = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const dataURL = canvas.toDataURL();
      setUndoStack(prev => [...prev.slice(-19), dataURL]); // Keep last 20 states
      setRedoStack([]);
    }
  };

  const saveProject = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const project: Project = {
        id: currentProject?.id || Date.now().toString(),
        name: projectName,
        canvas: canvas.toDataURL(),
        lastModified: new Date()
      };

      const updatedProjects = currentProject 
        ? projects.map(p => p.id === currentProject.id ? project : p)
        : [...projects, project];

      setProjects(updatedProjects);
      setCurrentProject(project);
      localStorage.setItem('image-editor-projects', JSON.stringify(updatedProjects));
      console.log('Project saved successfully!');
    }
  };

  const loadProject = (project: Project) => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      const img = new Image();
      img.onload = () => {
        ctx?.clearRect(0, 0, canvas.width, canvas.height);
        ctx?.drawImage(img, 0, 0);
        saveCanvasState();
      };
      img.src = project.canvas;
      setCurrentProject(project);
      setProjectName(project.name);
      setShowProjects(false);
    }
  };

  const deleteProject = (projectId: string) => {
    const updatedProjects = projects.filter(p => p.id !== projectId);
    setProjects(updatedProjects);
    localStorage.setItem('image-editor-projects', JSON.stringify(updatedProjects));
    if (currentProject?.id === projectId) {
      createNewProject();
    }
  };

  const createNewProject = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        saveCanvasState();
      }
    }
    setCurrentProject(null);
    setProjectName('Untitled Project');
    setShowProjects(false);
  };

  const undo = () => {
    if (undoStack.length > 1) {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (canvas && ctx) {
        const currentState = undoStack[undoStack.length - 1];
        const previousState = undoStack[undoStack.length - 2];
        
        setRedoStack(prev => [...prev, currentState]);
        setUndoStack(prev => prev.slice(0, -1));

        const img = new Image();
        img.onload = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0);
        };
        img.src = previousState;
      }
    }
  };

  const redo = () => {
    if (redoStack.length > 0) {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (canvas && ctx) {
        const nextState = redoStack[redoStack.length - 1];
        
        setUndoStack(prev => [...prev, nextState]);
        setRedoStack(prev => prev.slice(0, -1));

        const img = new Image();
        img.onload = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0);
        };
        img.src = nextState;
      }
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (canvas && ctx) {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      ctx.beginPath();
      ctx.moveTo(x, y);
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (canvas && ctx) {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      ctx.lineWidth = brushSize;
      ctx.lineCap = 'round';
      
      if (selectedTool === 'brush') {
        ctx.globalCompositeOperation = 'source-over';
        ctx.strokeStyle = brushColor;
      } else if (selectedTool === 'eraser') {
        ctx.globalCompositeOperation = 'destination-out';
      }

      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      saveCanvasState();
    }
  };

  return (
    <Window
      title="GIMP - Image Editor"
      onClose={onClose}
      onMinimize={onMinimize}
      onMaximize={onMaximize}
      zIndex={zIndex}
      initialSize={{ width: 1000, height: 700 }}
      isMaximized={isMaximized}
    >
      <div className="flex h-full">
        {showProjects ? (
          <div className="flex-1 p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Projects</h2>
              <div className="flex gap-2">
                <button 
                  onClick={createNewProject}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  New
                </button>
                <button 
                  onClick={() => setShowProjects(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Back to Editor
                </button>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {projects.map((project) => (
                <div key={project.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                  <img 
                    src={project.canvas} 
                    alt={project.name}
                    className="w-full h-32 object-contain border rounded mb-2"
                  />
                  <h3 className="font-semibold">{project.name}</h3>
                  <p className="text-sm text-gray-500">
                    {project.lastModified.toLocaleDateString()}
                  </p>
                  <div className="flex gap-2 mt-2">
                    <button 
                      onClick={() => loadProject(project)}
                      className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                    >
                      Open
                    </button>
                    <button 
                      onClick={() => deleteProject(project.id)}
                      className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <>
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
                <button 
                  onClick={saveProject}
                  className="p-2 hover:bg-gray-200 rounded flex items-center gap-1"
                >
                  <Save className="w-4 h-4" />
                  Save
                </button>
                <button 
                  onClick={() => setShowProjects(true)}
                  className="p-2 hover:bg-gray-200 rounded flex items-center gap-1"
                >
                  <FolderOpen className="w-4 h-4" />
                  Open
                </button>
                <button 
                  onClick={createNewProject}
                  className="p-2 hover:bg-gray-200 rounded flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  New
                </button>
                <div className="border-l border-gray-300 h-6 mx-2" />
                <input 
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="px-2 py-1 border border-gray-300 rounded text-sm"
                  placeholder="Project name"
                />
                <div className="border-l border-gray-300 h-6 mx-2" />
                <button 
                  onClick={undo}
                  disabled={undoStack.length <= 1}
                  className="p-2 hover:bg-gray-200 rounded disabled:opacity-50"
                >
                  <Undo className="w-4 h-4" />
                </button>
                <button 
                  onClick={redo}
                  disabled={redoStack.length === 0}
                  className="p-2 hover:bg-gray-200 rounded disabled:opacity-50"
                >
                  <Redo className="w-4 h-4" />
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
                  <canvas
                    ref={canvasRef}
                    width={800}
                    height={600}
                    className="cursor-crosshair"
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                  />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </Window>
  );
};
