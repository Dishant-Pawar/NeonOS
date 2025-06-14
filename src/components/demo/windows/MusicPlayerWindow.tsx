
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
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState([75]);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Demo music data - using a simple tone generator for demo purposes
  const demoTrack = {
    title: "RAVAN OS Demo Track",
    artist: "System Audio",
    album: "Demo Collection"
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', () => setIsPlaying(false));

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', () => setIsPlaying(false));
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (value: number[]) => {
    const audio = audioRef.current;
    if (!audio) return;
    
    audio.currentTime = (value[0] / 100) * duration;
    setCurrentTime(audio.currentTime);
  };

  const handleVolumeChange = (value: number[]) => {
    const audio = audioRef.current;
    if (!audio) return;
    
    setVolume(value);
    audio.volume = value[0] / 100;
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
      initialSize={{ width: 400, height: 300 }}
      initialPosition={{ x: 300, y: 200 }}
      isMaximized={isMaximized}
    >
      <div className="p-6 h-full bg-gradient-to-br from-purple-50 to-blue-50">
        {/* Demo audio element with a simple beep tone */}
        <audio
          ref={audioRef}
          src="data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhCDuO1fPTfS4AZmfq7tOVzgEYW7rqz8ybTwsNSKXh6q5iGQY7k9n23YIkBS6A0PLXfSkGKH7J8+GsVhMBUqfp6qpfGggzjdn21YQqASSCzvPaeSoELILN8NyNPgYTXLfn65NdEQVJrObopVgTB0ul4+2yeyMKOpPX89qCJwUhfMfp3ZJACAe1+LuyXTUfH0uf5u2tZCgBKnvG6N6QRwhZsOPz34UvBy582eGqYTsQN17H9N++bCYKK3zH9N2MNgUXaLnn9JZcEQRAqeLks1olBjdz2fPZhioAKXvH6d2QRQlYteP0zlQVBjJk4PXlkyQFE2nC7eOhXhIGUnLG9N2MNAQHarnn9JdaEAQ/qOPjs1soBDJgzO7HexsAYjXi7bNiWBEGUnDF89uGKgAncs33Kk7QFQVJo+nP95FJEAVHmuDqs14kBjRgxOzEgSMDGGm96N6MNgQZZrHq6KFjFAw5m97xwmIhBjZjxOy7fScAJX3M8d6PQgkWY7fq5JtiGwg8k9jz4YUqAR5+zPP"
          loop
        />
        
        {/* Album Art */}
        <div className="flex items-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-blue-500 rounded-lg flex items-center justify-center mr-4">
            <Music className="w-8 h-8 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">{demoTrack.title}</h3>
            <p className="text-sm text-gray-600">{demoTrack.artist}</p>
            <p className="text-xs text-gray-500">{demoTrack.album}</p>
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
          <button className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors">
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
          
          <button className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors">
            <SkipForward className="w-5 h-5 text-gray-700" />
          </button>
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
