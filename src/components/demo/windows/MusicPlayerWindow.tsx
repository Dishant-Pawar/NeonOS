
import React, { useState, useRef, useEffect } from 'react';
import { Window } from '../Window';
import { Play, Pause, SkipBack, SkipForward, Volume2, Music } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

interface MusicPlayerWindowProps {
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  zIndex: number;
  isMaximized?: boolean;
}

export const MusicPlayerWindow = ({ 
  onClose, 
  onMinimize, 
  onMaximize, 
  zIndex,
  isMaximized = false 
}: MusicPlayerWindowProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(180);
  const [volume, setVolume] = useState([75]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Demo music tracks with actual audio files
  const demoTracks = [
    {
      title: "Demo Music",
      artist: "YouTube Demo",
      album: "Demo Collection",
      url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      duration: 10
    },
    {
      title: "System Notification",
      artist: "System Audio",
      album: "Demo Collection", 
      url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      duration: 5
    },
    {
      title: "Demo Song",
      artist: "Sample Artist",
      album: "Demo Collection",
      url: "https://file-examples.com/storage/fe86c96637fa7b1bb5bd9ee/2017/11/file_example_MP3_700KB.mp3",
      duration: 30
    }
  ];

  const currentTrack = demoTracks[currentTrackIndex];

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration || currentTrack.duration);
    const handleLoadedData = () => {
      console.log('Audio loaded successfully');
      setDuration(audio.duration);
    };
    const handleError = (e: Event) => {
      console.log('Audio error:', e);
      // Fallback to simulated playback if audio fails to load
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('loadeddata', handleLoadedData);
    audio.addEventListener('ended', handleTrackEnd);
    audio.addEventListener('error', handleError);

    // Set volume when audio loads
    audio.volume = volume[0] / 100;

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('loadeddata', handleLoadedData);
      audio.removeEventListener('ended', handleTrackEnd);
      audio.removeEventListener('error', handleError);
    };
  }, [currentTrackIndex, volume]);

  const handleTrackEnd = () => {
    setIsPlaying(false);
    setCurrentTime(0);
    console.log('Track ended');
  };

  const togglePlay = () => {
    const audio = audioRef.current;
    
    if (audio) {
      if (isPlaying) {
        audio.pause();
        console.log('Audio paused');
      } else {
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              console.log('Audio playing successfully');
            })
            .catch(error => {
              console.log('Audio play failed:', error);
              // Browser might have blocked autoplay, show user feedback
              alert('Click to enable audio playback');
            });
        }
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSeek = (value: number[]) => {
    const newTime = (value[0] / 100) * duration;
    const audio = audioRef.current;
    
    if (audio && !isNaN(audio.duration)) {
      audio.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const audio = audioRef.current;
    setVolume(value);
    if (audio) {
      audio.volume = value[0] / 100;
      console.log('Volume set to:', value[0]);
    }
  };

  const skipTrack = (direction: 'prev' | 'next') => {
    const newIndex = direction === 'next' 
      ? (currentTrackIndex + 1) % demoTracks.length
      : (currentTrackIndex - 1 + demoTracks.length) % demoTracks.length;
    
    setCurrentTrackIndex(newIndex);
    setCurrentTime(0);
    setIsPlaying(false);
    setDuration(demoTracks[newIndex].duration);
    console.log('Switched to track:', demoTracks[newIndex].title);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <Window
      title="Music Player"
      onClose={onClose}
      onMinimize={onMinimize}
      onMaximize={onMaximize}
      zIndex={zIndex}
      initialSize={{ width: 400, height: 350 }}
      initialPosition={{ x: 300, y: 200 }}
      isMaximized={isMaximized}
    >
      <div className="p-6 h-full bg-gradient-to-br from-purple-50 to-blue-50">
        {/* Audio element */}
        <audio
          ref={audioRef}
          src={currentTrack.url}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          preload="metadata"
          crossOrigin="anonymous"
        />
        
        {/* Album Art */}
        <div className="flex items-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-blue-500 rounded-lg flex items-center justify-center mr-4">
            <Music className="w-8 h-8 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">{currentTrack.title}</h3>
            <p className="text-sm text-gray-600">{currentTrack.artist}</p>
            <p className="text-xs text-gray-500">{currentTrack.album}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <Slider
            value={[progressPercentage]}
            onValueChange={handleSeek}
            max={100}
            step={0.1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center space-x-4 mb-4">
          <button 
            onClick={() => skipTrack('prev')}
            className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
          >
            <SkipBack className="w-5 h-5 text-gray-700" />
          </button>
          
          <button
            onClick={togglePlay}
            className="p-3 rounded-full bg-blue-500 hover:bg-blue-600 text-white transition-colors"
          >
            {isPlaying ? (
              <Pause className="w-6 h-6" />
            ) : (
              <Play className="w-6 h-6 ml-1" />
            )}
          </button>
          
          <button 
            onClick={() => skipTrack('next')}
            className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
          >
            <SkipForward className="w-5 h-5 text-gray-700" />
          </button>
        </div>

        {/* Track Selection */}
        <div className="mb-4">
          <div className="flex space-x-2">
            {demoTracks.map((track, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentTrackIndex(index);
                  setCurrentTime(0);
                  setIsPlaying(false);
                  setDuration(track.duration);
                }}
                className={`px-3 py-1 rounded-lg text-xs transition-colors ${
                  currentTrackIndex === index
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                }`}
              >
                Track {index + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Volume Control */}
        <div className="flex items-center space-x-3">
          <Volume2 className="w-4 h-4 text-gray-600" />
          <Slider
            value={volume}
            onValueChange={handleVolumeChange}
            max={100}
            step={1}
            className="flex-1"
          />
          <span className="text-sm text-gray-600 w-8">{volume[0]}%</span>
        </div>

        {/* Audio Test Button */}
        <div className="mt-4">
          <button
            onClick={() => {
              const audio = audioRef.current;
              if (audio) {
                audio.load();
                console.log('Audio reloaded');
              }
            }}
            className="w-full px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm"
          >
            Reload Audio
          </button>
        </div>
      </div>
    </Window>
  );
};
