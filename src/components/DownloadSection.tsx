import { motion } from 'framer-motion';
import { Download, Check, RotateCcw } from 'lucide-react';
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
  if (!audioBlob) return null;

  const handleDownload = () => {
    const url = URL.createObjectURL(audioBlob);
    const a = document.createElement('a');
    a.href = url;
    
    const baseName = originalFileName.replace(/\.[^/.]+$/, '');
    a.download = `${baseName}.${format}`;
    
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="w-full space-y-4"
    >
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

      <div className="p-4 bg-success/5 border border-success/20 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-foreground">
              {originalFileName.replace(/\.[^/.]+$/, '')}.{format}
            </p>
            <p className="text-xs text-muted-foreground">
              {formatFileSize(audioBlob.size)} • {format.toUpperCase()}
            </p>
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
