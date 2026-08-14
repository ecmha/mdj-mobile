import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import MText from '@/components/Text';
import { useHomeTutorial } from '@/hooks/useHomeTutorial';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import { fontFamily, textAlign, textMini } from '@/theme';

const LINE_WIDTH = 80;
const DOT_SIZE = 8;
const SLIDE_DURATION = 1100;
const FADE_DURATION = 250;
const LIFT_DURATION = 200;

export default function HomeTutorial() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { visible } = useHomeTutorial();
  const { currentMessageId, barHeight } = useAudioPlayer();

  const isBarVisible = Boolean(currentMessageId) && barHeight > 0;
  const liftBy = isBarVisible ? Math.max(0, barHeight - insets.bottom) : 0;

  const progress = useSharedValue(0);
  const opacity = useSharedValue(0);
  const lift = useSharedValue(0);

  useEffect(() => {
    if (!visible) {
      opacity.value = withTiming(0, { duration: FADE_DURATION });
      return;
    }
    opacity.value = withTiming(1, { duration: FADE_DURATION });
    progress.value = 0;
    progress.value = withRepeat(
      withTiming(1, {
        duration: SLIDE_DURATION,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true,
    );
  }, [visible, opacity, progress]);

  useEffect(() => {
    lift.value = withTiming(-liftBy, { duration: LIFT_DURATION });
  }, [liftBy, lift]);

  const containerStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: lift.value }],
  }));

  const dotStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: progress.value * (LINE_WIDTH - DOT_SIZE) }],
  }));

  if (!visible) return null;

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.container,
        { paddingBottom: insets.bottom + 18 },
        containerStyle,
      ]}
    >
      <View style={styles.content}>
        <View style={styles.line}>
          <Animated.View style={[styles.dot, dotStyle]} />
        </View>

        <MText
          style={[
            textMini,
            textAlign.center,
            fontFamily.sfRegular,
            styles.label,
          ]}
        >
          {t('home.tutorial_swipe')}
        </MText>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 20,
    elevation: 20,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.72)',
    paddingHorizontal: 22,
    paddingVertical: 14,
    borderRadius: 16,
  },
  line: {
    width: LINE_WIDTH,
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
    justifyContent: 'center',
  },
  dot: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    backgroundColor: '#fff',
    position: 'absolute',
    left: 0,
  },
  label: {
    color: 'rgba(255, 255, 255, 0.85)',
  },
});
