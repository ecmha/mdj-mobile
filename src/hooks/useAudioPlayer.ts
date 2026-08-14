import { useContext } from 'react';
import { AudioProState, useAudioPro } from 'react-native-audio-pro';
import {
  AudioPlayerContext,
  parseMessageId,
} from '@/contexts/audioPlayerProvider';

// Position/duration/isPlaying/title come straight from react-native-audio-pro's
// own reactive hook rather than living in AudioPlayerContext — putting them
// there would re-render every consumer of the context on every progress
// tick, when only the mini-player actually needs that.
export const useAudioPlayer = () => {
  const context = useContext(AudioPlayerContext);
  const { state, position, duration, playingTrack, error } = useAudioPro();

  return {
    ...context,
    currentMessageId: parseMessageId(playingTrack?.id as string | undefined),
    position: position / 1000,
    duration: duration / 1000,
    isPlaying: state === AudioProState.PLAYING,
    isBuffering: state === AudioProState.LOADING,
    title: playingTrack?.title,
    fileUri: playingTrack?.url as string | undefined,
    error: context.error ?? (error ? 'playback_failed' : null),
  };
};
