import {
  ActivityIndicator,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import MText from '@/components/Text';
import { useTheme } from '@/hooks/useTheme';
import {
  bgPrimary,
  borderPrimary,
  borderW1,
  fontFamily,
  roundedLg,
  textColor,
  textPrimary,
} from '@/theme';
import { colors } from '@/theme/variables/colors';

type ButtonProps = {
  label: string;
  onPress: () => void;
  // `primary` is filled; `outline` is the secondary action next to it.
  variant?: 'primary' | 'outline';
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

// Full-width text button. Shows a spinner and ignores presses while `loading`.
export default function Button({
  label,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  style,
}: ButtonProps) {
  const theme = useTheme() ?? 'light';
  const isPrimary = variant === 'primary';
  const inactive = disabled || loading;

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      disabled={inactive}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: inactive, busy: loading }}
      style={[
        styles.button,
        roundedLg,
        isPrimary ? bgPrimary(theme) : [borderW1, borderPrimary(theme)],
        disabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          color={isPrimary ? 'white' : colors[theme].primary}
        />
      ) : (
        <MText
          style={[
            fontFamily.sfBold,
            isPrimary ? textColor('white') : textPrimary(theme),
          ]}
        >
          {label}
        </MText>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 50,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabled: {
    opacity: 0.5,
  },
});
