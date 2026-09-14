import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { bgDefault } from '@/theme';
import { Message } from '@/services/messages/types';
import styles from './styles';
import { useTheme } from '@/hooks/useTheme';
import HomeTool from './Tool';
import CTAListen from './CTAListen';
import CTAShare from './CTAShare';

export type HomeToolBarProps = {
  message?: Message | null;
  onPrevious: () => void;
  onNext: () => void;
  onBookmark: () => void;
  canGoPrevious?: boolean;
  canGoNext?: boolean;
};

export default function HomeToolBar({
  message,
  onPrevious,
  onNext,
  onBookmark,
  canGoPrevious = false,
  canGoNext = false,
}: HomeToolBarProps) {
  const { t } = useTranslation();
  const theme = useTheme() ?? 'light';

  return (
    <View style={[styles.toolbar, bgDefault(theme)]}>
      <View style={styles.side}>
        {canGoPrevious && (
          <HomeTool
            onPress={onPrevious}
            accessibilityLabel={t('home.previous_message')}
            icon="arrow-back"
          />
        )}
      </View>
      <View style={styles.center}>
        <CTAListen message={message} />
        <CTAShare message={message} />
        <HomeTool
          onPress={onBookmark}
          accessibilityLabel={t('home.bookmark.add')}
          icon="bookmark-outline"
          customStyles={styles.bookmarkUnavailable}
        />
      </View>
      <View style={styles.side}>
        {canGoNext && (
          <HomeTool
            onPress={onNext}
            accessibilityLabel={t('home.next_message')}
            icon="arrow-forward"
          />
        )}
      </View>
    </View>
  );
}
