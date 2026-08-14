import { createContext, useEffect, useRef, useState } from 'react';
import { Image } from 'react-native';
import { AudioPro, AudioProState } from 'react-native-audio-pro';
import { getSpeechFileUri } from '@/services/speech';
import { useLanguage } from '@/hooks/useLanguage';
import type { SupportedLanguage } from '@/i18n';

const FALLBACK_ARTWORK = Image.resolveAssetSource(
  require('@/assets/imgs/app_icon.png'),
).uri;

const TRACK_ID_SEPARATOR = '::';

const buildTrackId = (messageId: string, lang: SupportedLanguage) =>
  `${messageId}${TRACK_ID_SEPARATOR}${lang}`;

export const parseMessageId = (trackId?: string): string | null =>
  trackId ? trackId.split(TRACK_ID_SEPARATOR)[0] : null;

interface PlayMeta {
  title: string;
  artist: string;
  artwork?: string;
}

export type AudioPlayerContextProps = {
  isDownloading: boolean;
  error: string | null;
  barHeight: number;
  setBarHeight: (height: number) => void;
  play: (
    messageId: string,
    lang: SupportedLanguage,
    meta: PlayMeta,
  ) => Promise<void>;
  togglePlayPause: () => void;
};

export const AudioPlayerContext = createContext<AudioPlayerContextProps>({
  isDownloading: false,
  error: null,
  barHeight: 0,
  setBarHeight: () => {},
  play: async () => {},
  togglePlayPause: () => {},
});

interface ProviderProps {
  children: React.ReactNode;
}

export const AudioPlayerProvider = ({ children }: ProviderProps) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [barHeight, setBarHeight] = useState(0);
  // Guards against a stale getSpeechFileUri() resolving after a newer
  // play() call has already started (e.g. user taps two messages in a row).
  const requestIdRef = useRef(0);
  const { language } = useLanguage();
  const languageRef = useRef(language);

  useEffect(() => {
    if (languageRef.current === language) return;
    languageRef.current = language;
    requestIdRef.current++;
    AudioPro.clear();
    setIsDownloading(false);
    setError(null);
  }, [language]);

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
    } else if (
      state === AudioProState.STOPPED ||
      state === AudioProState.ERROR
    ) {
      // Track finished or errored out — replay it instead of leaving the
      // button unresponsive.
      const track = AudioPro.getPlayingTrack();
      if (track) AudioPro.play(track);
    }
  };

  const play = async (
    messageId: string,
    lang: SupportedLanguage,
    meta: PlayMeta,
  ) => {
    const trackId = buildTrackId(messageId, lang);
    if (AudioPro.getPlayingTrack()?.id === trackId) {
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
        id: trackId,
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
        barHeight,
        setBarHeight,
        play,
        togglePlayPause,
      }}
    >
      {children}
    </AudioPlayerContext.Provider>
  );
};
