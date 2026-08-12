import {
  AudioPro,
  AudioProContentType,
} from 'react-native-audio-pro';

/**
 * Wires up react-native-audio-pro. Must be called from the app entry point
 * (index.js), outside the React lifecycle — see the library's "Example Setup
 * Pattern" in its README.
 *
 * The addEventListener() call is not optional plumbing: the library subscribes
 * to the native event stream (and keeps the store behind useAudioPro() in sync)
 * from its emitter module's top level, and that module is only ever reached
 * through addEventListener(). Metro's inline-requires means an unreferenced
 * module is never evaluated, so without this call nothing subscribes and
 * playback state stays frozen on IDLE forever — while native audio plays fine.
 */
export function setupAudio() {
  AudioPro.configure({
    contentType: AudioProContentType.SPEECH,
    showNextPrevControls: false,
    showSkipControls: true,
    skipIntervalMs: 15000,
  });

  // No per-event handling needed at the app level — screens consume playback
  // state through useAudioPlayer(). Subscribing is what keeps that state live.
  AudioPro.addEventListener(() => {});
}
