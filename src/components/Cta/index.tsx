import {
  View,
  TouchableNativeFeedback,
  TouchableOpacity,
  Platform,
  ViewStyle,
  StyleProp,
} from 'react-native';

import styles from './styles';
import { useTheme } from '@/hooks/useTheme';
import { bgLight } from '@/theme';
import { ColorType } from '@/theme/types';
import { colors } from '@/theme/variables/colors';

type CTAPropsType = {
  onPress: () => void;
  disabled: boolean;
  color: ColorType;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
};

const Touchable =
  Platform.OS === 'android' ? TouchableNativeFeedback : TouchableOpacity;

export default function CTA({
  onPress,
  disabled,
  children,
  color,
  style,
}: CTAPropsType) {
  const theme = useTheme();
  return (
    <Touchable
      onPress={onPress}
      disabled={disabled}
      style={style}
      background={TouchableNativeFeedback.Ripple(
        colors[theme][color as ColorType],
        false,
      )}
    >
      <View style={[styles.cta, bgLight(theme)]}>{children}</View>
    </Touchable>
  );
}
