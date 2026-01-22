import { motion } from 'framer-motion';
import { Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ConvertButtonProps {
  onClick: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  isConverting?: boolean;
  progress?: number;
}

export const ConvertButton = ({ 
  onClick, 
  disabled, 
  isLoading, 
  isConverting, 
  progress = 0 
}: ConvertButtonProps) => {
  const isProcessing = isLoading || isConverting;
  
  const getButtonText = () => {
    if (isLoading) return 'Loading FFmpeg...';
    if (isConverting) return `Converting... ${progress}%`;
    return 'Convert to Audio';
  };

  return (
    <div className="w-full">
      <motion.div
        whileHover={!disabled && !isProcessing ? { scale: 1.02 } : {}}
        whileTap={!disabled && !isProcessing ? { scale: 0.98 } : {}}
      >
        <Button
          onClick={onClick}
          disabled={disabled || isProcessing}
          className={`
            relative w-full h-12 text-base font-semibold
            gradient-primary hover:gradient-primary-hover
            shadow-primary hover:shadow-lg
            disabled:opacity-50 disabled:cursor-not-allowed
            disabled:shadow-none
            transition-all duration-200
          `}
        >
          {isProcessing ? (
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
          ) : (
            <Sparkles className="w-5 h-5 mr-2" />
          )}
          {getButtonText()}
          
          {isConverting && (
            <motion.div
              className="absolute bottom-0 left-0 h-1 bg-primary-foreground/30 rounded-b-lg"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          )}
        </Button>
      </motion.div>
      
      {isLoading && (
        <p className="text-xs text-muted-foreground text-center mt-2">
          Loading conversion engine (first time only)...
        </p>
      )}
    </div>
  );
};
