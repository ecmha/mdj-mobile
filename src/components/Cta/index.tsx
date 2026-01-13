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
import { colors } from '@/theme/variables/colors';
import { useTheme } from '@/hooks/useTheme';
import { bgPrimaryLight } from '@/theme';

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
  const theme = useTheme() ?? 'light';
  return (
    <Touchable
      onPress={onPress}
      disabled={disabled}
      style={style}
      background={TouchableNativeFeedback.Ripple('#624a03ff', false)}
    >
      <View style={[styles.cta, bgPrimaryLight(theme)]}>
        <Icon name={icon} color={colors[theme][color]} size={25} />
      </View>
    </Touchable>
  );
}
