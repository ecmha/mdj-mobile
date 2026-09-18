import { useCallback, useEffect, useState } from 'react';
import { BackHandler, Image, Pressable, View } from 'react-native';
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
import { useTranslation } from 'react-i18next';
import MText from '@/components/Text';
import Button from '@/components/Button';
import { useAuth } from '@/hooks/useAuth';
import { useNavigation } from '@/hooks/useNavigation';
import { useTheme } from '@/hooks/useTheme';
import {
  bgColor,
  bgDefault,
  fontFamily,
  mt,
  textAlign,
  textLargeX1,
  textSmall,
} from '@/theme';
import { colors } from '@/theme/variables/colors';
import styles, { SHEET_BOTTOM_OFFSET, SHEET_HEIGHT } from './styles';

const OPEN_DURATION = 320;
const CLOSE_DURATION = 220;

// Bottom sheet asking a guest to log in or sign up. Opened through
// `useAuth().requireAuth()` and closed once a session opens.
//
// An in-screen overlay rather than a native Modal: a Modal would sit above
// every screen and hide Login / Signup. Mounted in the screen's layout, it
// stays open underneath them and is still there when the user comes back.
export default function AuthPromptModal() {
  const { promptVisible, closePrompt } = useAuth();
  const navigation = useNavigation();
  const theme = useTheme() ?? 'light';
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  // The overlay stays mounted until the slide-out has finished.
  const [mounted, setMounted] = useState(false);
  const progress = useSharedValue(0);
  const bottom = SHEET_BOTTOM_OFFSET + insets.bottom;

  useEffect(() => {
    if (promptVisible) {
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
  }, [promptVisible, progress]);

  // Android back closes the sheet, but only while this screen is focused:
  // on Login / Signup it must go back to this screen instead.
  useFocusEffect(
    useCallback(() => {
      if (!promptVisible) return;
      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        () => {
          closePrompt();
          return true;
        },
      );
      return () => subscription.remove();
    }, [promptVisible, closePrompt]),
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
        <Pressable
          style={styles.backdrop}
          onPress={closePrompt}
          accessibilityRole="button"
          accessibilityLabel={t('auth.prompt.close')}
        />
      </Animated.View>
      <Animated.View
        accessibilityViewIsModal
        style={[styles.sheet, bgDefault(theme), { bottom }, sheetStyle]}
      >
        <View style={styles.header}>
          <Image
            source={require('@/assets/imgs/app_logo.png')}
            style={styles.logo}
          />
          <MText
            accessibilityRole="header"
            style={[fontFamily.cormorantBold, textLargeX1, mt(12)]}
          >
            {t('auth.prompt.title')}
          </MText>
          <MText
            style={[fontFamily.sfRegular, textSmall, textAlign.center, mt(6)]}
          >
            {t('auth.prompt.description')}
          </MText>
        </View>
        <View>
          <Button
            label={t('auth.login.cta')}
            onPress={() => navigation.navigate('Login')}
          />
          <View style={[styles.separator, bgColor(colors[theme].divider)]} />
          <Button
            label={t('auth.signup.cta')}
            variant="outline"
            onPress={() => navigation.navigate('Signup')}
          />
        </View>
      </Animated.View>
    </View>
  );
}
