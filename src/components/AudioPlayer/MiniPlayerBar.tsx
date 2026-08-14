import { ActivityIndicator, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Share from 'react-native-share';
import { useTranslation } from 'react-i18next';
import CTA from '@/components/Cta';
import Icon from '@/components/Icon';
import MText from '@/components/Text';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import { useTheme } from '@/hooks/useTheme';
import { bgLight, bgPrimary, flex, flexContent, fontFamily, px, textMini } from '@/theme';
import { colors } from '@/theme/variables/colors';

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export default function MiniPlayerBar() {
  const { t } = useTranslation();
  const theme = useTheme() ?? 'light';
  const insets = useSafeAreaInsets();
  const {
    currentMessageId,
    isDownloading,
    isBuffering,
    isPlaying,
    position,
    duration,
    title,
    fileUri,
    error,
    togglePlayPause,
    setBarHeight,
  } = useAudioPlayer();

  if (!currentMessageId) return null;

  const progressRatio = duration > 0 ? Math.min(position / duration, 1) : 0;
  const showSpinner = isDownloading || isBuffering;

  const handleSave = () => {
    if (!fileUri) return;
    Share.open({
      url: fileUri,
      type: 'audio/mpeg',
      filename: title ?? 'meditation',
      saveToFiles: true,
      failOnCancel: false,
    }).catch(() => undefined);
  };

  return (
    <View
      onLayout={event => setBarHeight(event.nativeEvent.layout.height)}
      style={[
        styles.container,
        bgLight(theme),
        { paddingBottom: insets.bottom + 8, borderTopColor: colors[theme].divider },
      ]}
    >
      <View style={[styles.progressTrack, { backgroundColor: colors[theme].content_3 }]}>
        <View
          style={[
            styles.progressFill,
            bgPrimary(theme),
            { width: `${progressRatio * 100}%` },
          ]}
        />
      </View>
      <View style={[flex.row, styles.row]}>
        <CTA onPress={togglePlayPause} disabled={showSpinner} color="foreground">
          {showSpinner ? (
            <ActivityIndicator size="small" color={colors[theme].primary} />
          ) : (
            <Icon
              name={isPlaying ? 'pause' : 'play'}
              color="foreground"
              size={18}
            />
          )}
        </CTA>
        <View style={[flexContent(1), px(10)]}>
          <MText numberOfLines={1} style={[textMini, fontFamily.sfBold]}>
            {title ?? ''}
          </MText>
          <MText style={[textMini, fontFamily.sfRegular]}>
            {error
              ? t('audio.error')
              : `${formatTime(position)} / ${formatTime(duration)}`}
          </MText>
        </View>
        <TouchableOpacity onPress={handleSave} disabled={!fileUri} hitSlop={10}>
          <Icon name="share-outline" color="foreground" size={20} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingTop: 8,
    paddingHorizontal: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  progressTrack: {
    height: 3,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: 3,
  },
  row: {
    alignItems: 'center',
    marginTop: 8,
  },
});
