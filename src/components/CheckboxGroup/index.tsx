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
import { useState } from 'react';
import { ThemeType } from '@/theme/types';

export type CheckboxGroupProps<T extends string = string> = {
  header: string | null;
  items: {
    id: T;
    label: string;
    onPress: (id: T) => void;
  }[];
};

export default function CheckboxGroup<T extends string = string>({
  header,
  items,
}: CheckboxGroupProps<T>) {
  const theme = useTheme();
  const [selected, setSelected] = useState<T>(theme as T);
  return (
    <>
      {header && (
        <MText style={[styles.blocHeader, textBig, my(10)]}>{header}</MText>
      )}
      <View style={[styles.blocContent, overflow.hidden]}>
        {items.map(item => (
          <TouchableOpacity
            key={item.id}
            activeOpacity={0.7}
            style={[styles.item, bgLight(theme), px(10)]}
            onPress={() => {
              setSelected(item.id);
              item.onPress(item.id);
            }}
          >
            <MText style={[textSmall]}>{item.label}</MText>
            {selected === item.id ? (
              <Icon name="checkmark-circle" color="foreground" size={25} />
            ) : (
              <Icon name="ellipse-outline" color="foreground" size={25} />
            )}
          </TouchableOpacity>
        ))}
      </View>
    </>
  );
}
