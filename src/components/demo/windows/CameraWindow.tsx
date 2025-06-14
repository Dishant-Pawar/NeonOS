
import React, { useState, useRef, useEffect } from 'react';
import { Window } from '../Window';
import { Camera, Download, Trash2, Grid, Zap, Filter } from 'lucide-react';

interface CameraWindowProps {
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  zIndex: number;
}

interface CapturedPhoto {
  id: string;
  dataUrl: string;
  timestamp: number;
}

export const CameraWindow = ({ onClose, onMinimize, onMaximize, zIndex }: CameraWindowProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState<string>('');
  const [capturedPhotos, setCapturedPhotos] = useState<CapturedPhoto[]>([]);
  const [showGrid, setShowGrid] = useState(false);
  const [currentFilter, setCurrentFilter] = useState('none');
  const [isCapturing, setIsCapturing] = useState(false);

  const filters = [
    { name: 'none', label: 'Normal', css: '' },
    { name: 'grayscale', label: 'B&W', css: 'grayscale(100%)' },
    { name: 'sepia', label: 'Sepia', css: 'sepia(100%)' },
    { name: 'nightvision', label: 'Night Vision', css: 'hue-rotate(90deg) contrast(150%) brightness(80%)' },
    { name: 'cyber', label: 'Cyber', css: 'hue-rotate(180deg) saturate(200%) contrast(120%)' }
  ];

  useEffect(() => {
    startCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 640, height: 480 },
        audio: false 
      });
      
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
        setIsActive(true);
        setError('');
      }
    } catch (err) {
      console.error('Camera access denied:', err);
      setError('Camera access denied. Please grant permission to use the camera.');
      setIsActive(false);
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    setIsCapturing(true);
    
    // Flash effect
    const flashDiv = document.createElement('div');
    flashDiv.className = 'fixed inset-0 bg-white opacity-80 z-50 pointer-events-none';
    document.body.appendChild(flashDiv);
    
    setTimeout(() => {
      document.body.removeChild(flashDiv);
    }, 150);

    const canvas = canvasRef.current;
    const video = videoRef.current;
    const context = canvas.getContext('2d');
    
    if (context) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Apply current filter
      const filter = filters.find(f => f.name === currentFilter);
      if (filter) {
        context.filter = filter.css;
      }
      
      context.drawImage(video, 0, 0);
      
      const dataUrl = canvas.toDataURL('image/png');
      const newPhoto: CapturedPhoto = {
        id: Date.now().toString(),
        dataUrl,
        timestamp: Date.now()
      };
      
      setCapturedPhotos(prev => [newPhoto, ...prev]);
    }
    
    setTimeout(() => setIsCapturing(false), 300);
  };

  const downloadPhoto = (photo: CapturedPhoto) => {
    const link = document.createElement('a');
    link.download = `RAVAN_Camera_${new Date(photo.timestamp).toISOString().slice(0, 19).replace(/:/g, '-')}.png`;
    link.href = photo.dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const deletePhoto = (photoId: string) => {
    setCapturedPhotos(prev => prev.filter(photo => photo.id !== photoId));
  };

  const currentFilterStyle = filters.find(f => f.name === currentFilter)?.css || '';

  return (
    <Window
      title="RAVAN Camera"
      onClose={onClose}
      onMinimize={onMinimize}
      onMaximize={onMaximize}
      zIndex={zIndex}
      initialSize={{ width: 900, height: 700 }}
    >
      <div className="h-full bg-gray-900 text-green-400 font-mono overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-black/50 border-b border-green-500/30 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Camera className="w-5 h-5 text-green-400" />
              <span className="text-lg font-bold text-green-400 animate-pulse">
                RAVAN CAM v2.1 | ACTIVE
              </span>
            </div>
            <div className="flex items-center space-x-2 text-xs">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>RECORDING READY</span>
            </div>
          </div>
        </div>

        <div className="flex-1 flex">
          {/* Camera View */}
          <div className="flex-1 p-4">
            <div className="relative bg-black rounded-lg overflow-hidden border-2 border-green-500/50 shadow-lg shadow-green-500/20">
              {error ? (
                <div className="h-80 flex items-center justify-center text-red-400 bg-black">
                  <div className="text-center">
                    <Camera className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-bold">CAMERA ACCESS DENIED</p>
                    <p className="text-sm mt-2">{error}</p>
                    <button 
                      onClick={startCamera}
                      className="mt-4 px-4 py-2 bg-green-600 hover:bg-green-700 rounded text-white transition-colors"
                    >
                      Retry Access
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <video
                    ref={videoRef}
                    className="w-full h-80 object-cover"
                    style={{ filter: currentFilterStyle }}
                    autoPlay
                    muted
                  />
                  
                  {/* Grid Overlay */}
                  {showGrid && (
                    <div className="absolute inset-0 pointer-events-none">
                      <div className="w-full h-full grid grid-cols-3 grid-rows-3">
                        {Array.from({ length: 9 }).map((_, i) => (
                          <div key={i} className="border border-green-400/30"></div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Scanlines Effect */}
                  <div className="absolute inset-0 pointer-events-none opacity-20">
                    <div className="w-full h-full bg-gradient-to-b from-transparent via-green-400/10 to-transparent animate-pulse"></div>
                  </div>
                </>
              )}
              
              <canvas ref={canvasRef} className="hidden" />
            </div>

            {/* Controls */}
            <div className="mt-4 flex items-center justify-center space-x-4">
              <button
                onClick={() => setShowGrid(!showGrid)}
                className={`p-3 rounded-full border transition-all ${
                  showGrid 
                    ? 'bg-green-600 border-green-400 text-white shadow-lg shadow-green-500/50' 
                    : 'border-green-500/50 text-green-400 hover:border-green-400 hover:shadow-md hover:shadow-green-500/30'
                }`}
                title="Toggle Grid"
              >
                <Grid className="w-5 h-5" />
              </button>
              
              <button
                onClick={capturePhoto}
                disabled={!isActive || isCapturing}
                className={`p-4 rounded-full border-2 transition-all ${
                  isCapturing
                    ? 'bg-white border-white scale-110'
                    : 'border-green-400 text-green-400 hover:bg-green-600 hover:text-white hover:scale-105 hover:shadow-lg hover:shadow-green-500/50'
                } ${!isActive ? 'opacity-50 cursor-not-allowed' : ''}`}
                title="Capture Photo"
              >
                <Camera className="w-6 h-6" />
              </button>
              
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-green-400" />
                <select
                  value={currentFilter}
                  onChange={(e) => setCurrentFilter(e.target.value)}
                  className="bg-black border border-green-500/50 text-green-400 px-3 py-2 rounded focus:outline-none focus:border-green-400"
                >
                  {filters.map(filter => (
                    <option key={filter.name} value={filter.name}>
                      {filter.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Photo Gallery */}
          <div className="w-72 border-l border-green-500/30 bg-black/50 p-4">
            <div className="flex items-center space-x-2 mb-4">
              <Zap className="w-4 h-4 text-green-400" />
              <span className="text-sm font-bold">CAPTURED [{capturedPhotos.length}]</span>
            </div>
            
            <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
              {capturedPhotos.length === 0 ? (
                <div className="text-center py-8 text-green-600">
                  <Camera className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-xs">No photos captured</p>
                </div>
              ) : (
                capturedPhotos.map(photo => (
                  <div key={photo.id} className="bg-black/50 border border-green-500/30 rounded p-2">
                    <img
                      src={photo.dataUrl}
                      alt="Captured"
                      className="w-full h-24 object-cover rounded border border-green-500/20"
                    />
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-green-600">
                        {new Date(photo.timestamp).toLocaleTimeString()}
                      </span>
                      <div className="flex space-x-1">
                        <button
                          onClick={() => downloadPhoto(photo)}
                          className="p-1 text-blue-400 hover:text-blue-300 transition-colors"
                          title="Download"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deletePhoto(photo.id)}
                          className="p-1 text-red-400 hover:text-red-300 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </Window>
  );
};
