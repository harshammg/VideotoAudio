import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, Check, RotateCcw, Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { OutputFormat } from '@/hooks/useFFmpeg';

interface DownloadSectionProps {
  audioBlob: Blob | null;
  originalFileName: string;
  format: OutputFormat;
  onReset: () => void;
}

export const DownloadSection = ({ 
  audioBlob, 
  originalFileName, 
  format,
  onReset 
}: DownloadSectionProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  useEffect(() => {
    if (audioBlob) {
      const url = URL.createObjectURL(audioBlob);
      setAudioUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [audioBlob]);

  if (!audioBlob || !audioUrl) return null;

  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = audioUrl;
    
    const baseName = originalFileName.replace(/\.[^/.]+$/, '');
    const ext = format.startsWith('mp3') ? 'mp3' : 'wav';
    a.download = `${baseName}.${ext}`;
    
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const formatTime = (time: number): string => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="w-full space-y-4"
    >
      <audio
        ref={audioRef}
        src={audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
      />

      <div className="flex items-center justify-center gap-2 text-success">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', bounce: 0.5, delay: 0.1 }}
          className="p-1 rounded-full bg-success/10"
        >
          <Check className="w-4 h-4" />
        </motion.div>
        <span className="text-sm font-medium">Conversion complete!</span>
      </div>

      <div className="p-4 bg-success/5 border border-success/20 rounded-lg space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-foreground">
              {originalFileName.replace(/\.[^/.]+$/, '')}.{format.startsWith('mp3') ? 'mp3' : 'wav'}
            </p>
            <p className="text-xs text-muted-foreground">
              {formatFileSize(audioBlob.size)} • {format.toUpperCase()}
            </p>
          </div>
        </div>

        {/* Audio Player */}
        <div className="flex items-center gap-3 pt-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={togglePlay}
            className="p-2 rounded-full bg-primary text-primary-foreground"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
          </motion.button>

          <div className="flex-1 space-y-1">
            <div className="relative h-1.5 bg-muted rounded-full overflow-hidden">
              <div 
                className="absolute inset-y-0 left-0 bg-primary rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
              <input
                type="range"
                min={0}
                max={duration || 0}
                value={currentTime}
                onChange={handleSeek}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <motion.div
          className="flex-1"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            onClick={handleDownload}
            className="w-full h-11 gradient-primary shadow-primary font-semibold"
          >
            <Download className="w-4 h-4 mr-2" />
            Download Audio
          </Button>
        </motion.div>
        
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            onClick={onReset}
            variant="outline"
            className="h-11 px-4"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
};