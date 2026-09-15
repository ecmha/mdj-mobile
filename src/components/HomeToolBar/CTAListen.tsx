import { ActivityIndicator, View } from 'react-native';
import { colors } from '@/theme/variables/colors';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/hooks/useTheme';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import { Message } from '@/services/messages/types';
import { API_URL } from '@env';
import HomeTool from './Tool';
import styles from './styles';
import { useLanguage } from '@/hooks/useLanguage';
import { useCallback } from 'react';
import Icon from '../Icon';

export type CTAListenProps = {
  message?: Message | null;
};

export default function CTAListen({ message }: CTAListenProps) {
  const { t } = useTranslation();
  const theme = useTheme() ?? 'light';
  const { language } = useLanguage();
  const { isDownloading, isBuffering, play, isPlaying, isIdle, isStopped } =
    useAudioPlayer();

  const showSpinner = isDownloading || isBuffering;

  const handleListen = useCallback(() => {
    if (message) {
      play(message.id, language, {
        title: message.title,
        artist: t('welcome.title_line2'),
        artwork: message.cover
          ? `${API_URL}/files/${message.cover}/view`
          : undefined,
      });
    }
  }, [message, language, play, t]);

  const renderPlayPauseButton = useCallback(() => {
    if (isIdle || isStopped) return null;
    if (isPlaying) {
      return (
        <View
          style={[
            styles.stateIconContainer,
            { backgroundColor: colors[theme].background },
          ]}
        >
          <Icon name="pause" size={14} color={'foreground'} />
        </View>
      );
    }

    return (
      <View
        style={[
          styles.stateIconContainer,
          { backgroundColor: colors[theme].background },
        ]}
      >
        <Icon name="play" size={14} color={'foreground'} />
      </View>
    );
  }, [isPlaying, isIdle, isStopped, theme]);

  return showSpinner ? (
    <View style={styles.button}>
      <ActivityIndicator size="small" color={colors[theme].primary} />
    </View>
  ) : (
    <View>
      <HomeTool
        onPress={handleListen}
        accessibilityLabel={t('audio.listen')}
        icon="headset-outline"
      />
      {renderPlayPauseButton()}
    </View>
  );
}
