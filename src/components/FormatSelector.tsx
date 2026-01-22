import { motion } from 'framer-motion';
import { Music, Waves } from 'lucide-react';
import type { OutputFormat } from '@/hooks/useFFmpeg';

interface FormatSelectorProps {
  value: OutputFormat;
  onChange: (format: OutputFormat) => void;
  disabled?: boolean;
}

const formats: { value: OutputFormat; label: string; icon: typeof Music; description: string }[] = [
  { value: 'mp3-128', label: 'MP3', icon: Music, description: '128kbps • Smaller file' },
  { value: 'mp3-320', label: 'MP3 HD', icon: Music, description: '320kbps • Best quality' },
  { value: 'wav', label: 'WAV', icon: Waves, description: 'Lossless • Largest file' },
];

export const FormatSelector = ({ value, onChange, disabled }: FormatSelectorProps) => {
  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-foreground mb-3">
        Output Format
      </label>
      
      <div className="grid grid-cols-3 gap-3">
        {formats.map((format) => {
          const Icon = format.icon;
          const isSelected = value === format.value;
          
          return (
            <motion.button
              key={format.value}
              whileHover={!disabled ? { scale: 1.02 } : {}}
              whileTap={!disabled ? { scale: 0.98 } : {}}
              onClick={() => !disabled && onChange(format.value)}
              disabled={disabled}
              className={`
                relative flex flex-col items-center gap-2 p-4 rounded-lg border-2 
                transition-all duration-200
                ${isSelected 
                  ? 'border-primary bg-primary/5' 
                  : 'border-border hover:border-primary/30 bg-card'
                }
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              {isSelected && (
                <motion.div
                  layoutId="format-indicator"
                  className="absolute inset-0 rounded-lg border-2 border-primary"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                />
              )}
              
              <div className={`
                p-2 rounded-full transition-colors duration-200
                ${isSelected ? 'bg-primary/10' : 'bg-muted'}
              `}>
                <Icon className={`w-5 h-5 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
              </div>
              
              <div className="text-center">
                <p className={`text-sm font-semibold ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                  {format.label}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {format.description}
                </p>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
