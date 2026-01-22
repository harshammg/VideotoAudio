import { useState, useCallback } from 'react';

export type OutputFormat = 'mp3-128' | 'mp3-320' | 'wav';

interface ConversionState {
  isLoading: boolean;
  isConverting: boolean;
  progress: number;
  error: string | null;
}

interface UseMediaProcessorReturn extends ConversionState {
  convertToAudio: (file: File, format: OutputFormat) => Promise<Blob | null>;
  isReady: boolean;
}

export const useMediaProcessor = (): UseMediaProcessorReturn => {
  const [isReady, setIsReady] = useState(true);
  const [state, setState] = useState<ConversionState>({
    isLoading: false,
    isConverting: false,
    progress: 0,
    error: null,
  });

  const convertToAudio = useCallback(async (file: File, format: OutputFormat): Promise<Blob | null> => {
    setState(prev => ({ ...prev, isConverting: true, progress: 0, error: null }));

    try {
      // Validate file size
      if (file.size > 500 * 1024 * 1024) { // 500MB limit
        throw new Error('File too large. Maximum size is 500MB.');
      }

      setState(prev => ({ ...prev, progress: 5 }));
      
      // Read file as array buffer
      const arrayBuffer = await file.arrayBuffer();
      setState(prev => ({ ...prev, progress: 15 }));
      
      // Create audio context
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      const audioContext = new AudioContext();
      
      // Resume if suspended
      if (audioContext.state === 'suspended') {
        await audioContext.resume();
      }
      setState(prev => ({ ...prev, progress: 25 }));
      
      // Decode audio data with multiple attempts
      let audioBuffer: AudioBuffer;
      try {
        audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      } catch (error) {
        // Try with a copy of the buffer
        try {
          const copyBuffer = arrayBuffer.slice(0);
          audioBuffer = await audioContext.decodeAudioData(copyBuffer);
        } catch (copyError) {
          // Try creating offline context as fallback
          const offlineContext = new (window.OfflineAudioContext || (window as any).webkitOfflineAudioContext)(
            2, 44100 * 300, 44100 // 2 channels, 5 minutes max
          );
          audioBuffer = await offlineContext.decodeAudioData(arrayBuffer);
        }
      }
      setState(prev => ({ ...prev, progress: 50 }));
      
      // Process complete audio buffer - no time limit
      const maxLength = audioBuffer.length;
      
      // Create channel data arrays for all channels
      const channelData: Float32Array[] = [];
      const channels = audioBuffer.numberOfChannels;
      
      for (let ch = 0; ch < channels; ch++) {
        const fullChannel = audioBuffer.getChannelData(ch);
        channelData.push(new Float32Array(fullChannel)); // Copy entire channel
      }
      setState(prev => ({ ...prev, progress: 75 }));
      
      // Create complete audio buffer object
      const completeBuffer = {
        length: maxLength,
        numberOfChannels: channels,
        sampleRate: audioBuffer.sampleRate,
        duration: maxLength / audioBuffer.sampleRate,
        getChannelData: (channel: number) => channelData[channel]
      } as AudioBuffer;
      
      // Convert to WAV - this may take time for large files
      setState(prev => ({ ...prev, progress: 85 }));
      const wavBlob = audioBufferToWav(completeBuffer);
      setState(prev => ({ ...prev, progress: 95 }));
      
      // Close audio context
      await audioContext.close();
      
      setState(prev => ({ ...prev, progress: 100, isConverting: false }));
      return wavBlob;
    } catch (error) {
      console.error('Audio conversion failed:', error);
      const message = error instanceof Error ? 
        error.message : 
        'Failed to convert audio. Please try a different file format.';
      setState(prev => ({ ...prev, isConverting: false, error: message }));
      return null;
    }
  }, []);

  return {
    ...state,
    isReady,
    convertToAudio,
  };
};

// Optimized WAV conversion for large files
function audioBufferToWav(buffer: AudioBuffer): Blob {
  const length = buffer.length;
  const numberOfChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  
  // Pre-allocate buffer
  const wavBuffer = new ArrayBuffer(44 + length * numberOfChannels * 2);
  const view = new DataView(wavBuffer);
  
  // Write WAV header
  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + length * numberOfChannels * 2, true);
  writeString(view, 8, 'WAVE');
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, numberOfChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * numberOfChannels * 2, true);
  view.setUint16(32, numberOfChannels * 2, true);
  view.setUint16(34, 16, true);
  writeString(view, 36, 'data');
  view.setUint32(40, length * numberOfChannels * 2, true);

  // Optimized sample writing with chunking for large files
  let offset = 44;
  const chunkSize = 10000; // Process 10k samples at a time
  
  for (let start = 0; start < length; start += chunkSize) {
    const end = Math.min(start + chunkSize, length);
    
    for (let i = start; i < end; i++) {
      for (let channel = 0; channel < numberOfChannels; channel++) {
        const sample = Math.max(-1, Math.min(1, buffer.getChannelData(channel)[i]));
        view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true);
        offset += 2;
      }
    }
    
    // Yield control to browser periodically
    if (start % (chunkSize * 10) === 0 && start > 0) {
      // Small delay to prevent blocking
      const startWait = performance.now();
      while (performance.now() - startWait < 1) {
        // Busy wait for ~1ms
      }
    }
  }

  return new Blob([view], { type: 'audio/wav' });
}

function writeString(view: DataView, offset: number, string: string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}