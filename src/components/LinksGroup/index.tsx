import { View } from 'react-native';
import MText from '@/components/Text';
import {
  flex,
  alignItems,
  bgLight,
  overflow,
  textBig,
  my,
  px,
  pl,
  textSmall,
} from '@/theme';
import Icon, { IconNameType } from '@/components/Icon';
import { TouchableOpacity } from 'react-native';
import styles from './styles';
import { useTheme } from '@/hooks/useTheme';

export type LinksGroupProps = {
  header: string;
  links: {
    id: string;
    icon: IconNameType;
    label: string;
    onPress: () => void;
  }[];
};

export default function LinksGroup({ header, links }: LinksGroupProps) {
  const theme = useTheme();
  return (
    <>
      <MText style={[styles.blocHeader, textBig, my(10)]}>{header}</MText>
      <View style={[styles.blocContent, overflow.hidden]}>
        {links.map(link => (
          <TouchableOpacity
            key={link.id}
            activeOpacity={0.7}
            style={[styles.item, bgLight(theme)]}
            onPress={link.onPress}
          >
            <View style={[flex.row, alignItems.center, px(10)]}>
              <Icon name={link.icon} color="foreground" size={20} />
              <MText style={[textSmall, pl(10)]}>{link.label}</MText>
            </View>
            <Icon name="chevron-forward-outline" color="foreground" size={20} />
          </TouchableOpacity>
        ))}
      </View>
    </>
  );
}
