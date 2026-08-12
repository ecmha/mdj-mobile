import { createContext, useRef, useState } from 'react';
import { Image } from 'react-native';
import { AudioPro, AudioProState } from 'react-native-audio-pro';
import { getSpeechFileUri } from '@/services/speech';

const FALLBACK_ARTWORK = Image.resolveAssetSource(
  require('@/assets/imgs/app_icon.png'),
).uri;

interface PlayMeta {
  title: string;
  artist: string;
  artwork?: string;
}

export type AudioPlayerContextProps = {
  isDownloading: boolean;
  error: string | null;
  play: (messageId: string, lang: string, meta: PlayMeta) => Promise<void>;
  togglePlayPause: () => void;
};

export const AudioPlayerContext = createContext<AudioPlayerContextProps>({
  isDownloading: false,
  error: null,
  play: async () => {},
  togglePlayPause: () => {},
});

interface ProviderProps {
  children: React.ReactNode;
}

export const AudioPlayerProvider = ({ children }: ProviderProps) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Guards against a stale getSpeechFileUri() resolving after a newer
  // play() call has already started (e.g. user taps two messages in a row).
  const requestIdRef = useRef(0);

  // AudioPro.configure() lives in setupAudio() (src/services/audio), called
  // from index.js — the library requires setup outside the React lifecycle.

  // isPlaying/currentMessageId are intentionally not tracked here — they're
  // derived from react-native-audio-pro's own reactive state in
  // useAudioPlayer() so there's a single source of truth for what's
  // actually playing.
  const togglePlayPause = () => {
    const state = AudioPro.getState();
    if (state === AudioProState.PLAYING) {
      AudioPro.pause();
    } else if (state === AudioProState.PAUSED) {
      AudioPro.resume();
    } else if (state === AudioProState.STOPPED || state === AudioProState.ERROR) {
      // Track finished or errored out — replay it instead of leaving the
      // button unresponsive.
      const track = AudioPro.getPlayingTrack();
      if (track) AudioPro.play(track);
    }
  };

  const play = async (messageId: string, lang: string, meta: PlayMeta) => {
    if (AudioPro.getPlayingTrack()?.id === messageId) {
      togglePlayPause();
      return;
    }

    setError(null);
    setIsDownloading(true);
    const requestId = ++requestIdRef.current;
    try {
      const uri = await getSpeechFileUri(messageId, lang);
      if (requestId !== requestIdRef.current) return;
      AudioPro.play({
        id: messageId,
        url: uri,
        title: meta.title,
        artist: meta.artist,
        artwork: meta.artwork ?? FALLBACK_ARTWORK,
      });
    } catch {
      if (requestId === requestIdRef.current) setError('playback_failed');
    } finally {
      if (requestId === requestIdRef.current) setIsDownloading(false);
    }
  };

  return (
    <AudioPlayerContext.Provider
      value={{
        isDownloading,
        error,
        play,
        togglePlayPause,
      }}
    >
      {children}
    </AudioPlayerContext.Provider>
  );
};
