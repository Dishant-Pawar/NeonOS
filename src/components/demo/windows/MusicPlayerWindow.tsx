
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
  const [duration, setDuration] = useState(180); // 3 minutes demo duration
  const [volume, setVolume] = useState([75]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Demo music tracks including the YouTube video
  const demoTracks = [
    {
      title: "Demo Music",
      artist: "YouTube Demo",
      album: "Demo Collection",
      url: "https://youtu.be/Wz6oMSign6Q?si=wQgjnCim6WI1IyCa",
      duration: 180
    },
    {
      title: "RAVAN OS System Audio",
      artist: "System Audio",
      album: "Demo Collection",
      url: "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhCDuO1fPTfS4AZmfq7tOVzgEYW7rqz8ybTwsNSKXh6q5iGQY7k9n23YIkBS6A0PLXfSkGKH7J8+GsVhMBUqfp6qpfGggzjdn21YQqASSCzvPaeSoELILN8NyNPgYTXLfn65NdEQVJrObopVgTB0ul4+2yeyMKOpPX89qCJwUhfMfp3ZJACAe1+LuyXTUfH0uf5u2tZCgBKnvG6N6QRwhZsOPz34UvBy582eGqYTsQN17H9N++bCYKK3zH9N2MNgUXaLnn9JZcEQRAqeLks1olBjdz2fPZhioAKXvH6d2QRQlYteP0zlQVBjJk4PXlkyQFE2nC7eOhXhIGUnLG9N2MNAQHarnn9JdaEAQ/qOPjs1soBDJgzO7HexsAYjXi7bNiWBEGUnDF89uGKgAncs33Kk7QFQVJo+nP95FJEAVHmuDqs14kBjRgxOzEgSMDGGm96N6MNgQZZrHq6KFjFAw5m97xwmIhBjZjxOy7fScAJX3M8d6PQgkWY7fq5JtiGwg8k9jz4YUqAR5+zPP",
      duration: 30
    }
  ];

  const currentTrack = demoTracks[currentTrackIndex];

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration || currentTrack.duration);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleTrackEnd);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleTrackEnd);
    };
  }, [currentTrackIndex]);

  // Simulate playback for YouTube track
  useEffect(() => {
    if (isPlaying && currentTrackIndex === 0) {
      // For YouTube demo track, simulate time progress
      intervalRef.current = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= duration) {
            handleTrackEnd();
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, currentTrackIndex, duration]);

  const handleTrackEnd = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const togglePlay = () => {
    const audio = audioRef.current;
    
    if (currentTrackIndex === 0) {
      // YouTube demo track - simulate playback
      setIsPlaying(!isPlaying);
      console.log(`${isPlaying ? 'Pausing' : 'Playing'} YouTube demo track: ${currentTrack.title}`);
    } else if (audio) {
      // Regular audio track
      if (isPlaying) {
        audio.pause();
      } else {
        audio.play().catch(console.error);
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSeek = (value: number[]) => {
    const newTime = (value[0] / 100) * duration;
    
    if (currentTrackIndex === 0) {
      // YouTube demo track
      setCurrentTime(newTime);
    } else {
      // Regular audio track
      const audio = audioRef.current;
      if (audio) {
        audio.currentTime = newTime;
        setCurrentTime(newTime);
      }
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const audio = audioRef.current;
    setVolume(value);
    if (audio) {
      audio.volume = value[0] / 100;
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
        {/* Audio element for non-YouTube tracks */}
        {currentTrackIndex > 0 && (
          <audio
            ref={audioRef}
            src={currentTrack.url}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />
        )}
        
        {/* Album Art */}
        <div className="flex items-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-blue-500 rounded-lg flex items-center justify-center mr-4">
            <Music className="w-8 h-8 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">{currentTrack.title}</h3>
            <p className="text-sm text-gray-600">{currentTrack.artist}</p>
            <p className="text-xs text-gray-500">{currentTrack.album}</p>
            {currentTrackIndex === 0 && (
              <p className="text-xs text-blue-500 mt-1">YouTube Demo Track</p>
            )}
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
                {index === 0 ? 'YouTube Demo' : 'System Audio'}
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
      </div>
    </Window>
  );
};
