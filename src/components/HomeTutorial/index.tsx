import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useEffect } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import MText from '@/components/Text';
import { useTranslation } from 'react-i18next';
import {
  textLargeX1,
  textMedium,
  fontFamily,
  textAlign,
  bgPrimary,
  roundedLg,
  textColor,
} from '@/theme';
import { useTheme } from '@/hooks/useTheme';

type Props = {
  visible: boolean;
  onDismiss: () => void;
};

export default function HomeTutorial({ visible, onDismiss }: Props) {
  const { t } = useTranslation();
  const theme = useTheme() ?? 'light';
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.4, { duration: 500, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 500, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      false,
    );
  }, [scale]);

  const arrowStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const containerStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  if (!visible) return null;

  const handleDismiss = () => {
    opacity.value = withTiming(0, { duration: 300 }, () => {});
    onDismiss();
  };

  return (
    <Animated.View style={[styles.overlay, containerStyle]}>
      <View style={styles.content}>
        <View style={styles.hintRow}>
          <Animated.View style={arrowStyle}>
            <Ionicons name="arrow-back" size={28} color="#fff" />
          </Animated.View>

          <MText
            style={[
              textLargeX1,
              textAlign.center,
              fontFamily.cormorant,
              styles.hint,
            ]}
          >
            {t('home.tutorial_hint')}
          </MText>

          <Animated.View style={arrowStyle}>
            <Ionicons name="arrow-forward" size={28} color="#fff" />
          </Animated.View>
        </View>

        <MText
          style={[
            textMedium,
            textAlign.center,
            fontFamily.sfRegular,
            styles.sub,
          ]}
        >
          {t('home.tutorial_sub')}
        </MText>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleDismiss}
          style={[styles.button, bgPrimary(theme), roundedLg]}
        >
          <MText style={[textMedium, fontFamily.sfBold, textColor('white')]}>
            {t('home.tutorial_dismiss')}
          </MText>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.72)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 40,
    gap: 24,
  },
  hintRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  hint: {
    color: '#fff',
    fontSize: 26,
  },
  sub: {
    color: 'rgba(255,255,255,0.75)',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
});
