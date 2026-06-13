import { View, TouchableOpacity, ViewStyle, StyleProp } from 'react-native';

import styles from './styles';
import { useTheme } from '@/hooks/useTheme';
import { bgLight } from '@/theme';
import { ColorType } from '@/theme/types';

type CTAPropsType = {
  onPress: () => void;
  disabled: boolean;
  color: ColorType;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
};

const Touchable = TouchableOpacity;

export default function CTA({
  onPress,
  disabled,
  children,
  style,
}: CTAPropsType) {
  const theme = useTheme();
  return (
    <Touchable
      onPress={onPress}
      disabled={disabled}
      style={style}
      activeOpacity={0.5}
    >
      <View style={[styles.cta, bgLight(theme)]}>{children}</View>
    </Touchable>
  );
}
