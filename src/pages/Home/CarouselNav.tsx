import { View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import CTA from '@/components/Cta';
import Icon from '@/components/Icon';

type CarouselNavProps = {
  canGoPrevious: boolean;
  canGoNext: boolean;
  onPrevious: () => void;
  onNext: () => void;
};

/**
 * Floating previous/next controls for the Home carousel. Each side is only
 * rendered when scrolling in that direction is actually possible, so a single
 * message shows no control at all.
 */
export default function CarouselNav({
  canGoPrevious,
  canGoNext,
  onPrevious,
  onNext,
}: CarouselNavProps) {
  const { t } = useTranslation();

  return (
    <>
      {canGoPrevious && (
        <View style={styles.navLeft}>
          <CTA
            onPress={onPrevious}
            disabled={false}
            color="foreground"
            accessibilityLabel={t('home.previous_message')}
          >
            <Icon name="chevron-back" color="foreground" size={25} />
          </CTA>
        </View>
      )}
      {canGoNext && (
        <View style={styles.navRight}>
          <CTA
            onPress={onNext}
            disabled={false}
            color="foreground"
            accessibilityLabel={t('home.next_message')}
          >
            <Icon name="chevron-forward" color="foreground" size={25} />
          </CTA>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  navLeft: {
    position: 'absolute',
    bottom: 20,
    left: 20,
  },
  navRight: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
});
