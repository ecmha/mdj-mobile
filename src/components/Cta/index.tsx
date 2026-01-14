import {
  View,
  TouchableNativeFeedback,
  TouchableOpacity,
  Platform,
  ViewStyle,
  StyleProp,
} from 'react-native';

import styles from './styles';
import Icon, { IconNameType } from '../Icon';
import { useTheme } from '@/hooks/useTheme';
import { bgLight } from '@/theme';
import { ColorType } from '@/theme/types';
import { colors } from '@/theme/variables/colors';

type CTAPropsType = {
  onPress: () => void;
  disabled: boolean;
  icon: IconNameType;
  color: ColorType;
  style?: StyleProp<ViewStyle>;
};

const Touchable =
  Platform.OS === 'android' ? TouchableNativeFeedback : TouchableOpacity;

export default function CTA({
  onPress,
  disabled,
  icon,
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
      <View style={[styles.cta, bgLight(theme)]}>
        <Icon name={icon} color={color} size={25} />
      </View>
    </Touchable>
  );
}
