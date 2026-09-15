import { useEffect } from 'react';
import {
  AccessibilityInfo,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import MText from '@/components/Text';
import { fontFamily, textAlign, textMini } from '@/theme';

const DEFAULT_DURATION = 2500;
const FADE_DURATION = 250;

type ToastProps = {
  message: string | null;
  onHide: () => void;
  duration?: number;
  style?: StyleProp<ViewStyle>;
};

// Short, non-interactive notice. The parent owns `message`: set it to show the
// toast, and clear it in `onHide` (called once `duration` has elapsed).
export default function Toast({
  message,
  onHide,
  duration = DEFAULT_DURATION,
  style,
}: ToastProps) {
  useEffect(() => {
    if (!message) return;
    AccessibilityInfo.announceForAccessibility(message);
    const timer = setTimeout(onHide, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onHide]);

  if (!message) return null;

  return (
    <Animated.View
      entering={FadeIn.duration(FADE_DURATION)}
      exiting={FadeOut.duration(FADE_DURATION)}
      style={[styles.container, style]}
    >
      <View style={styles.content}>
        <MText
          style={[
            textMini,
            textAlign.center,
            fontFamily.sfRegular,
            styles.label,
          ]}
        >
          {message}
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
    zIndex: 20,
    elevation: 20,
    pointerEvents: 'none',
  },
  content: {
    backgroundColor: 'rgba(0, 0, 0, 0.72)',
    paddingHorizontal: 22,
    paddingVertical: 14,
    borderRadius: 16,
  },
  label: {
    color: 'rgba(255, 255, 255, 0.85)',
  },
});
