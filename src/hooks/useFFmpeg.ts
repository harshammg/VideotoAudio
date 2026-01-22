import { useState, useRef, useCallback } from 'react';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

export type OutputFormat = 'mp3-128' | 'mp3-320' | 'wav';

interface ConversionState {
  isLoading: boolean;
  isConverting: boolean;
  progress: number;
  error: string | null;
}

interface UseFFmpegReturn extends ConversionState {
  convertToAudio: (file: File, format: OutputFormat) => Promise<Blob | null>;
  isReady: boolean;
}

export const useFFmpeg = (): UseFFmpegReturn => {
  const ffmpegRef = useRef<FFmpeg | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [state, setState] = useState<ConversionState>({
    isLoading: false,
    isConverting: false,
    progress: 0,
    error: null,
  });

  const loadFFmpeg = useCallback(async () => {
    if (ffmpegRef.current) return ffmpegRef.current;

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const ffmpeg = new FFmpeg();
      ffmpegRef.current = ffmpeg;

      ffmpeg.on('progress', ({ progress }) => {
        setState(prev => ({ ...prev, progress: Math.round(progress * 100) }));
      });

      const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm';
      
      await ffmpeg.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
      });

      setIsReady(true);
      setState(prev => ({ ...prev, isLoading: false }));
      return ffmpeg;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load FFmpeg';
      setState(prev => ({ ...prev, isLoading: false, error: message }));
      return null;
    }
  }, []);

  const convertToAudio = useCallback(async (file: File, format: OutputFormat): Promise<Blob | null> => {
    setState(prev => ({ ...prev, isConverting: true, progress: 0, error: null }));

    try {
      const ffmpeg = await loadFFmpeg();
      if (!ffmpeg) {
        throw new Error('FFmpeg failed to load');
      }

      const inputName = 'input' + file.name.substring(file.name.lastIndexOf('.'));
      const outputExt = format.startsWith('mp3') ? 'mp3' : 'wav';
      const outputName = `output.${outputExt}`;

      await ffmpeg.writeFile(inputName, await fetchFile(file));

      const isMP3 = format.startsWith('mp3');
      const audioCodec = isMP3 ? 'libmp3lame' : 'pcm_s16le';
      const bitrate = format === 'mp3-128' ? ['-b:a', '128k'] : format === 'mp3-320' ? ['-b:a', '320k'] : [];

      await ffmpeg.exec([
        '-i', inputName,
        '-vn',
        '-acodec', audioCodec,
        ...bitrate,
        outputName
      ]);

      const data = await ffmpeg.readFile(outputName);
      const mimeType = isMP3 ? 'audio/mpeg' : 'audio/wav';
      const uint8Array = data as Uint8Array;
      const blob = new Blob([new Uint8Array(uint8Array)], { type: mimeType });

      // Cleanup
      await ffmpeg.deleteFile(inputName);
      await ffmpeg.deleteFile(outputName);

      setState(prev => ({ ...prev, isConverting: false, progress: 100 }));
      return blob;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Conversion failed';
      setState(prev => ({ ...prev, isConverting: false, error: message }));
      return null;
    }
  }, [loadFFmpeg]);

  return {
    ...state,
    isReady,
    convertToAudio,
  };
};
