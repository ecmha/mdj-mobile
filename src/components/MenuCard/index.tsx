import { TouchableOpacity, View } from 'react-native';
import Icon, { IconNameType } from '@/components/Icon';
import MText from '@/components/Text';
import { useTheme } from '@/hooks/useTheme';
import { fontFamily, mt, p, roundedMd, textAlign, textSmall } from '@/theme';
import styles from './styles';

export type MenuCardProps = {
  label: string;
  icon: IconNameType;
  backgroundColor: string;
  onPress: () => void;
};

export default function MenuCard({
  label,
  icon,
  backgroundColor,
  onPress,
}: MenuCardProps) {
  const theme = useTheme() ?? 'light';

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor }, roundedMd, p(16)]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <View
        style={[
          styles.iconWrapper,
          theme === 'dark' ? styles.iconWrapperDark : styles.iconWrapperLight,
        ]}
      >
        <Icon name={icon} color="foreground" size={30} />
      </View>
      <MText
        style={[textSmall, fontFamily.cormorantBold, textAlign.center, mt(12)]}
        numberOfLines={2}
      >
        {label}
      </MText>
    </TouchableOpacity>
  );
}
