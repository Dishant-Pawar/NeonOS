import React, { useState, useRef } from 'react';
import { Window } from '../Window';
import { Play, Pause, Volume2, VolumeX, SkipBack, SkipForward, Maximize2, RotateCcw } from 'lucide-react';

interface VideoPlayerWindowProps {
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  zIndex: number;
  isMaximized?: boolean;
}

export const VideoPlayerWindow = ({ 
  onClose, 
  onMinimize, 
  onMaximize, 
  zIndex, 
  isMaximized = false 
}: VideoPlayerWindowProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const videoRef = useRef<HTMLVideoElement>(null);

  const sampleVideos = [
    { 
      name: 'Big Buck Bunny', 
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      type: 'video/mp4'
    },
    { 
      name: 'Elephant Dream', 
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      type: 'video/mp4'
    },
    { 
      name: 'Sintel Trailer', 
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
      type: 'video/mp4'
    },
    { 
      name: 'Tears of Steel', 
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
      type: 'video/mp4'
    }
  ];

  const [selectedVideo, setSelectedVideo] = useState(sampleVideos[0]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch((error) => {
          console.log('Video play error:', error);
          // Try to reload the video if play fails
          if (videoRef.current) {
            videoRef.current.load();
          }
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
      console.log('Video loaded successfully:', selectedVideo.name);
    }
  };

  const handleVideoError = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    console.log('Video error for', selectedVideo.name, ':', e);
    // Try next video if current one fails
    const currentIndex = sampleVideos.findIndex(v => v.name === selectedVideo.name);
    const nextIndex = (currentIndex + 1) % sampleVideos.length;
    if (nextIndex !== currentIndex) {
      console.log('Trying next video:', sampleVideos[nextIndex].name);
      setSelectedVideo(sampleVideos[nextIndex]);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = parseFloat(e.target.value);
    setVolume(vol);
    if (videoRef.current) {
      videoRef.current.volume = vol;
    }
  };

  const skipTime = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime += seconds;
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const resetVideo = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      setCurrentTime(0);
    }
  };

  const handleVideoChange = (video: typeof sampleVideos[0]) => {
    console.log('Changing to video:', video.name);
    setSelectedVideo(video);
    setIsPlaying(false);
    setCurrentTime(0);
    if (videoRef.current) {
      videoRef.current.load();
    }
  };

  const handleCanPlay = () => {
    console.log('Video can play:', selectedVideo.name);
  };

  return (
    <>
      <Window
        title="RAVAN Video Player"
        onClose={onClose}
        onMinimize={onMinimize}
        onMaximize={onMaximize}
        zIndex={zIndex}
        initialSize={{ width: 900, height: 650 }}
        initialPosition={{ x: 150, y: 80 }}
        isMaximized={isMaximized}
      >
        <div className="h-full bg-gradient-to-br from-gray-900 to-black text-white flex flex-col">
          {/* Video Area */}
          <div className="flex-1 relative bg-black">
            <video
              ref={videoRef}
              className="w-full h-full object-contain"
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onError={handleVideoError}
              onCanPlay={handleCanPlay}
              preload="metadata"
              playsInline
            >
              <source src={selectedVideo.url} type={selectedVideo.type} />
              Your browser does not support the video tag.
            </video>
            
            {/* Video Overlay Controls */}
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
              <button
                onClick={togglePlay}
                className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
              >
                {isPlaying ? (
                  <Pause className="w-8 h-8 text-white" />
                ) : (
                  <Play className="w-8 h-8 text-white ml-1" />
                )}
              </button>
            </div>

            {/* Loading indicator */}
            {duration === 0 && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                  <p className="text-white text-sm">Loading video...</p>
                </div>
              </div>
            )}
          </div>

          {/* Controls Panel */}
          <div className="bg-gray-800 p-4 space-y-4">
            {/* Progress Bar */}
            <div className="space-y-2">
              <input
                type="range"
                min="0"
                max={duration}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer video-slider"
              />
              <div className="flex justify-between text-sm text-gray-400">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Control Buttons */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={resetVideo}
                  className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>
                <button
                  onClick={() => skipTime(-10)}
                  className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <SkipBack className="w-5 h-5" />
                </button>
                <button
                  onClick={togglePlay}
                  className="p-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                >
                  {isPlaying ? (
                    <Pause className="w-6 h-6" />
                  ) : (
                    <Play className="w-6 h-6 ml-0.5" />
                  )}
                </button>
                <button
                  onClick={() => skipTime(10)}
                  className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <SkipForward className="w-5 h-5" />
                </button>
              </div>

              {/* Volume Controls */}
              <div className="flex items-center space-x-3">
                <button
                  onClick={toggleMute}
                  className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-20 h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>

            {/* Video Selection */}
            <div className="border-t border-gray-700 pt-4">
              <h4 className="text-sm font-medium mb-2 text-gray-300">Available Animated Videos:</h4>
              <div className="flex flex-wrap gap-2">
                {sampleVideos.map((video) => (
                  <button
                    key={video.name}
                    onClick={() => handleVideoChange(video)}
                    className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                      selectedVideo.name === video.name
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                    }`}
                  >
                    {video.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Window>

      <style>
        {`
          .video-slider::-webkit-slider-thumb {
            appearance: none;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: #3b82f6;
            cursor: pointer;
          }
          
          .video-slider::-moz-range-thumb {
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: #3b82f6;
            cursor: pointer;
            border: none;
          }
        `}
      </style>
    </>
  );
};
