import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Video, Shield, Zap } from 'lucide-react';
import { useMediaProcessor, type OutputFormat } from '@/hooks/useMediaProcessor';
import { UploadZone } from './UploadZone';
import { FormatSelector } from './FormatSelector';
import { ConvertButton } from './ConvertButton';
import { DownloadSection } from './DownloadSection';
export const VideoConverter = () => {
  const [file, setFile] = useState<File | null>(null);
  const [format, setFormat] = useState<OutputFormat>('mp3-128');
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const {
    isLoading,
    isConverting,
    progress,
    error,
    convertToAudio
  } = useMediaProcessor();
  const handleConvert = useCallback(async () => {
    if (!file) return;
    setAudioBlob(null);
    const result = await convertToAudio(file, format);
    if (result) {
      setAudioBlob(result);
    }
  }, [file, format, convertToAudio]);
  const handleReset = useCallback(() => {
    setFile(null);
    setAudioBlob(null);
  }, []);
  const isProcessing = isLoading || isConverting;
  return <div className="w-full max-w-md mx-auto px-4">
      <motion.div initial={{
      opacity: 0,
      y: 20
    }} animate={{
      opacity: 1,
      y: 0
    }} transition={{
      duration: 0.5
    }} className="text-center mb-8">
        
        
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Video to Audio
        </h1>
        <p className="text-muted-foreground">
          Extract audio from any video instantly
        </p>
      </motion.div>

      <motion.div initial={{
      opacity: 0,
      y: 20
    }} animate={{
      opacity: 1,
      y: 0
    }} transition={{
      duration: 0.5,
      delay: 0.1
    }} className="bg-card rounded-2xl shadow-card border border-border p-6 space-y-6">
        {!audioBlob ? <>
            <UploadZone file={file} onFileSelect={setFile} disabled={isProcessing} />
            
            <FormatSelector value={format} onChange={setFormat} disabled={isProcessing} />
            
            <ConvertButton onClick={handleConvert} disabled={!file} isLoading={isLoading} isConverting={isConverting} progress={progress} />
            
            {error && <motion.p initial={{
          opacity: 0
        }} animate={{
          opacity: 1
        }} className="text-sm text-destructive text-center">
                {error}
              </motion.p>}
          </> : <DownloadSection audioBlob={audioBlob} originalFileName={file?.name || 'audio'} format={format} onReset={handleReset} />}
      </motion.div>

      <motion.div initial={{
      opacity: 0
    }} animate={{
      opacity: 1
    }} transition={{
      delay: 0.4
    }} className="mt-8 flex items-center justify-center gap-6 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <Shield className="w-3.5 h-3.5" />
          <span>100% Private</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5" />
          <span>Browser-based</span>
        </div>
      </motion.div>

      <motion.p initial={{
      opacity: 0
    }} animate={{
      opacity: 1
    }} transition={{
      delay: 0.5
    }} className="text-center text-xs text-muted-foreground mt-4">
        Simple. Fast. No uploads saved.
      </motion.p>
    </div>;
};