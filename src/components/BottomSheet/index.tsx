import { useCallback, useEffect, useState } from 'react';
import { BackHandler, Pressable, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/useTheme';
import { bgDefault } from '@/theme';
import styles, { SHEET_BOTTOM_OFFSET, SHEET_HEIGHT } from './styles';

const OPEN_DURATION = 320;
const CLOSE_DURATION = 220;

type BottomSheetProps = {
  visible: boolean;
  // Backdrop tap and Android back. Omit it for a sheet the user must answer.
  onDismiss?: () => void;
  dismissLabel?: string;
  children: React.ReactNode;
};

// Sheet that slides up from the bottom over the current screen, with a fading
// backdrop. An in-screen overlay rather than a native Modal: a Modal would sit
// above every screen, so it would hide a screen pushed while it is open.
export default function BottomSheet({
  visible,
  onDismiss,
  dismissLabel,
  children,
}: BottomSheetProps) {
  const theme = useTheme() ?? 'light';
  const insets = useSafeAreaInsets();
  // Stays mounted until the slide-out has finished.
  const [mounted, setMounted] = useState(false);
  const progress = useSharedValue(0);
  const bottom = SHEET_BOTTOM_OFFSET + insets.bottom;

  useEffect(() => {
    if (visible) {
      setMounted(true);
      progress.value = withTiming(1, {
        duration: OPEN_DURATION,
        easing: Easing.out(Easing.cubic),
      });
    } else {
      progress.value = withTiming(
        0,
        { duration: CLOSE_DURATION, easing: Easing.in(Easing.cubic) },
        finished => {
          // Not finished = reopened mid-close: keep the overlay mounted.
          if (finished) scheduleOnRN(setMounted, false);
        },
      );
    }
  }, [visible, progress]);

  // Android back closes the sheet, but only while its screen is focused: on a
  // screen pushed above it, back must return to that screen instead.
  useFocusEffect(
    useCallback(() => {
      if (!visible || !onDismiss) return;
      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        () => {
          onDismiss();
          return true;
        },
      );
      return () => subscription.remove();
    }, [visible, onDismiss]),
  );

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
  }));

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: interpolate(
          progress.value,
          [0, 1],
          [SHEET_HEIGHT + bottom, 0],
        ),
      },
    ],
  }));

  if (!mounted) return null;

  return (
    <View style={styles.overlay}>
      <Animated.View style={[styles.backdrop, backdropStyle]}>
        {onDismiss ? (
          <Pressable
            style={styles.backdrop}
            onPress={onDismiss}
            accessibilityRole="button"
            accessibilityLabel={dismissLabel}
          />
        ) : null}
      </Animated.View>
      <Animated.View
        accessibilityViewIsModal
        style={[styles.sheet, bgDefault(theme), { bottom }, sheetStyle]}
      >
        {children}
      </Animated.View>
    </View>
  );
}
