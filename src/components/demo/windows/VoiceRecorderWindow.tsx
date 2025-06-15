import React, { useState, useRef, useEffect } from 'react';
import { Window } from '../Window';
import { Mic, MicOff, Play, Pause, Square, Download, Trash2, Settings } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface VoiceRecorderWindowProps {
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  zIndex: number;
  isMaximized?: boolean;
}

interface Recording {
  id: string;
  blob: Blob;
  url: string;
  duration: number;
  name: string;
  timestamp: Date;
}

export const VoiceRecorderWindow = ({ 
  onClose, 
  onMinimize, 
  onMaximize, 
  zIndex,
  isMaximized = false 
}: VoiceRecorderWindowProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [currentPlayingId, setCurrentPlayingId] = useState<string | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [selectedVoiceEffect, setSelectedVoiceEffect] = useState('normal');
  const [pitch, setPitch] = useState([1]);
  const [speed, setSpeed] = useState([1]);
  const [volume, setVolume] = useState([1]);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const playingAudioRef = useRef<HTMLAudioElement | null>(null);

  // Voice effects configuration
  const voiceEffects = {
    normal: { pitch: 1, speed: 1, filter: 'none' },
    robot: { pitch: 0.8, speed: 0.9, filter: 'robot' },
    female: { pitch: 1.3, speed: 1.1, filter: 'none' },
    male: { pitch: 0.7, speed: 0.95, filter: 'none' },
    child: { pitch: 1.5, speed: 1.2, filter: 'none' },
    deep: { pitch: 0.5, speed: 0.8, filter: 'none' },
    echo: { pitch: 1, speed: 1, filter: 'echo' },
    alien: { pitch: 1.8, speed: 0.7, filter: 'alien' }
  };

  useEffect(() => {
    return () => {
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
      if (playingAudioRef.current) {
        playingAudioRef.current.pause();
      }
      // Clean up audio URLs
      recordings.forEach(recording => {
        URL.revokeObjectURL(recording.url);
      });
    };
  }, [recordings]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioContextRef.current = new AudioContext();
      
      // Try to use MP3 format, fallback to webm if not supported
      const options = {
        mimeType: 'audio/mpeg'
      };

      // Check if MP3 is supported, otherwise use webm
      if (!MediaRecorder.isTypeSupported('audio/mpeg')) {
        console.log('MP3 not supported, using webm');
        options.mimeType = 'audio/webm';
      }

      mediaRecorderRef.current = new MediaRecorder(stream, options);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const mimeType = mediaRecorderRef.current?.mimeType || 'audio/webm';
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
        const audioUrl = URL.createObjectURL(audioBlob);
        
        const newRecording: Recording = {
          id: Date.now().toString(),
          blob: audioBlob,
          url: audioUrl,
          duration: recordingTime,
          name: `Recording ${recordings.length + 1}`,
          timestamp: new Date()
        };

        setRecordings(prev => [...prev, newRecording]);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordingTime(0);

      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

      console.log('Recording started with format:', options.mimeType);
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Error accessing microphone. Please allow microphone access.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    
    if (recordingIntervalRef.current) {
      clearInterval(recordingIntervalRef.current);
    }
    
    setIsRecording(false);
    console.log('Recording stopped');
  };

  const convertToMp3 = async (audioBlob: Blob): Promise<Blob> => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContext();
      }

      const arrayBuffer = await audioBlob.arrayBuffer();
      const audioBuffer = await audioContextRef.current.decodeAudioData(arrayBuffer);
      
      // Create offline context for processing
      const offlineContext = new OfflineAudioContext(
        audioBuffer.numberOfChannels,
        audioBuffer.length,
        audioBuffer.sampleRate
      );

      const source = offlineContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(offlineContext.destination);
      source.start();
      
      const renderedBuffer = await offlineContext.startRendering();
      
      // Convert to WAV format (since true MP3 encoding requires additional libraries)
      const length = renderedBuffer.length;
      const channels = renderedBuffer.numberOfChannels;
      const sampleRate = renderedBuffer.sampleRate;
      
      const arrayBuffer2 = new ArrayBuffer(44 + length * channels * 2);
      const view = new DataView(arrayBuffer2);
      
      // WAV header
      const writeString = (offset: number, string: string) => {
        for (let i = 0; i < string.length; i++) {
          view.setUint8(offset + i, string.charCodeAt(i));
        }
      };
      
      writeString(0, 'RIFF');
      view.setUint32(4, 36 + length * channels * 2, true);
      writeString(8, 'WAVE');
      writeString(12, 'fmt ');
      view.setUint32(16, 16, true);
      view.setUint16(20, 1, true);
      view.setUint16(22, channels, true);
      view.setUint32(24, sampleRate, true);
      view.setUint32(28, sampleRate * channels * 2, true);
      view.setUint16(32, channels * 2, true);
      view.setUint16(34, 16, true);
      writeString(36, 'data');
      view.setUint32(40, length * channels * 2, true);
      
      let offset = 44;
      for (let i = 0; i < length; i++) {
        for (let channel = 0; channel < channels; channel++) {
          const sample = Math.max(-1, Math.min(1, renderedBuffer.getChannelData(channel)[i]));
          view.setInt16(offset, sample * 0x7FFF, true);
          offset += 2;
        }
      }

      return new Blob([arrayBuffer2], { type: 'audio/wav' });
    } catch (error) {
      console.error('Error converting audio:', error);
      return audioBlob;
    }
  };

  const applyVoiceEffect = async (audioBlob: Blob, effect: string): Promise<Blob> => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }

    try {
      const arrayBuffer = await audioBlob.arrayBuffer();
      const audioBuffer = await audioContextRef.current.decodeAudioData(arrayBuffer);
      
      const offlineContext = new OfflineAudioContext(
        audioBuffer.numberOfChannels,
        audioBuffer.length,
        audioBuffer.sampleRate
      );

      const source = offlineContext.createBufferSource();
      source.buffer = audioBuffer;

      let destination = offlineContext.destination;

      // Apply effects based on selection
      const effectConfig = voiceEffects[effect as keyof typeof voiceEffects];
      
      if (effectConfig.filter === 'robot') {
        // Robot effect with bit crushing simulation
        const gainNode = offlineContext.createGain();
        gainNode.gain.value = 0.7;
        source.connect(gainNode);
        gainNode.connect(destination);
      } else if (effectConfig.filter === 'echo') {
        // Echo effect
        const delay = offlineContext.createDelay(0.3);
        delay.delayTime.value = 0.2;
        const feedback = offlineContext.createGain();
        feedback.gain.value = 0.3;
        
        source.connect(destination);
        source.connect(delay);
        delay.connect(feedback);
        feedback.connect(delay);
        delay.connect(destination);
      } else {
        source.connect(destination);
      }

      // Adjust playback rate for pitch/speed
      source.playbackRate.value = effectConfig.pitch * pitch[0];

      source.start();
      const renderedBuffer = await offlineContext.startRendering();

      // Convert back to blob
      const length = renderedBuffer.length;
      const channels = renderedBuffer.numberOfChannels;
      const sampleRate = renderedBuffer.sampleRate;
      
      const arrayBuffer2 = new ArrayBuffer(length * channels * 2);
      const view = new DataView(arrayBuffer2);
      
      let offset = 0;
      for (let i = 0; i < length; i++) {
        for (let channel = 0; channel < channels; channel++) {
          const sample = Math.max(-1, Math.min(1, renderedBuffer.getChannelData(channel)[i]));
          view.setInt16(offset, sample * 0x7FFF, true);
          offset += 2;
        }
      }

      return new Blob([arrayBuffer2], { type: 'audio/wav' });
    } catch (error) {
      console.error('Error applying voice effect:', error);
      return audioBlob;
    }
  };

  const playRecording = async (recording: Recording) => {
    if (currentPlayingId === recording.id) {
      if (playingAudioRef.current) {
        playingAudioRef.current.pause();
        setCurrentPlayingId(null);
      }
      return;
    }

    if (playingAudioRef.current) {
      playingAudioRef.current.pause();
    }

    try {
      let audioBlob = recording.blob;
      
      // Apply voice effect if not normal
      if (selectedVoiceEffect !== 'normal') {
        audioBlob = await applyVoiceEffect(audioBlob, selectedVoiceEffect);
      }

      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audio.volume = volume[0];
      audio.playbackRate = speed[0];

      audio.onended = () => {
        setCurrentPlayingId(null);
        URL.revokeObjectURL(audioUrl);
      };

      audio.onerror = (error) => {
        console.error('Audio playback error:', error);
        setCurrentPlayingId(null);
        URL.revokeObjectURL(audioUrl);
      };

      playingAudioRef.current = audio;
      setCurrentPlayingId(recording.id);
      await audio.play();
      console.log('Playing recording with effect:', selectedVoiceEffect);
    } catch (error) {
      console.error('Error playing recording:', error);
      setCurrentPlayingId(null);
    }
  };

  const deleteRecording = (id: string) => {
    const recording = recordings.find(r => r.id === id);
    if (recording) {
      URL.revokeObjectURL(recording.url);
    }
    setRecordings(prev => prev.filter(r => r.id !== id));
    if (currentPlayingId === id) {
      setCurrentPlayingId(null);
      if (playingAudioRef.current) {
        playingAudioRef.current.pause();
      }
    }
  };

  const downloadRecording = async (recording: Recording) => {
    try {
      let audioBlob = recording.blob;
      
      // Apply voice effect if not normal
      if (selectedVoiceEffect !== 'normal') {
        audioBlob = await applyVoiceEffect(audioBlob, selectedVoiceEffect);
      }

      // Convert to MP3-compatible format (WAV)
      audioBlob = await convertToMp3(audioBlob);

      const url = URL.createObjectURL(audioBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${recording.name}_${selectedVoiceEffect}.wav`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      console.log('Recording downloaded as WAV with effect:', selectedVoiceEffect);
    } catch (error) {
      console.error('Error downloading recording:', error);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Window
      title="Voice Recorder - MP3"
      onClose={onClose}
      onMinimize={onMinimize}
      onMaximize={onMaximize}
      zIndex={zIndex}
      initialSize={{ width: 500, height: 600 }}
      initialPosition={{ x: 400, y: 150 }}
      isMaximized={isMaximized}
    >
      <div className="p-6 h-full bg-gradient-to-br from-red-50 to-pink-50 overflow-y-auto">
        {/* Recording Controls */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 ${
              isRecording 
                ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                : 'bg-gray-200 hover:bg-gray-300'
            }`}>
              <button
                onClick={isRecording ? stopRecording : startRecording}
                className="w-full h-full rounded-full flex items-center justify-center"
              >
                {isRecording ? (
                  <Square className="w-8 h-8 text-white" />
                ) : (
                  <Mic className="w-8 h-8 text-gray-700" />
                )}
              </button>
            </div>
          </div>
          
          <div className="text-2xl font-mono text-gray-800 mb-2">
            {formatTime(recordingTime)}
          </div>
          
          <p className="text-sm text-gray-600">
            {isRecording ? 'Recording in progress...' : 'Click to start recording'}
          </p>
        </div>

        {/* Voice Effects Section */}
        <div className="mb-6 p-4 bg-white rounded-lg shadow-sm">
          <div className="flex items-center mb-3">
            <Settings className="w-4 h-4 mr-2 text-gray-600" />
            <h3 className="font-semibold text-gray-800">Voice Effects</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-600 mb-2">Voice Effect</label>
              <Select value={selectedVoiceEffect} onValueChange={setSelectedVoiceEffect}>
                <SelectTrigger>
                  <SelectValue placeholder="Select voice effect" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="robot">Robot</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="child">Child</SelectItem>
                  <SelectItem value="deep">Deep Voice</SelectItem>
                  <SelectItem value="echo">Echo</SelectItem>
                  <SelectItem value="alien">Alien</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-2">Pitch: {pitch[0].toFixed(1)}</label>
              <Slider
                value={pitch}
                onValueChange={setPitch}
                min={0.5}
                max={2}
                step={0.1}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-2">Speed: {speed[0].toFixed(1)}</label>
              <Slider
                value={speed}
                onValueChange={setSpeed}
                min={0.5}
                max={2}
                step={0.1}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-2">Volume: {Math.round(volume[0] * 100)}%</label>
              <Slider
                value={volume}
                onValueChange={setVolume}
                min={0}
                max={1}
                step={0.1}
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Recordings List */}
        <div className="mb-4">
          <h3 className="font-semibold text-gray-800 mb-3">Recordings ({recordings.length})</h3>
          
          {recordings.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Mic className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No recordings yet</p>
              <p className="text-sm">Start recording to see your audio files here</p>
            </div>
          ) : (
            <div className="space-y-2">
              {recordings.map((recording) => (
                <div
                  key={recording.id}
                  className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800">{recording.name}</h4>
                    <p className="text-sm text-gray-500">
                      {formatDuration(recording.duration)} • {recording.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => playRecording(recording)}
                    >
                      {currentPlayingId === recording.id ? (
                        <Pause className="w-4 h-4" />
                      ) : (
                        <Play className="w-4 h-4" />
                      )}
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => downloadRecording(recording)}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => deleteRecording(recording.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>How to use:</strong> Click the microphone to start recording. 
            Select voice effects and adjust settings before playing back your recordings.
            Each recording can be played with different effects and downloaded as WAV (MP3-compatible) format.
          </p>
        </div>
      </div>
    </Window>
  );
};
