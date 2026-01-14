import { ColorType } from '@/theme/types';
import { colors } from '@/theme/variables/colors';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import { ComponentProps } from 'react';
import { useTheme } from '@/hooks/useTheme';

export type IconNameType = ComponentProps<typeof Ionicons>['name'];

export type IconPropsType = ComponentProps<typeof Ionicons> & {
  color: ColorType;
};

const Icon = ({ color, ...props }: IconPropsType) => {
  const theme = useTheme();

  return <Ionicons {...props} color={colors[theme][color as ColorType]} />;
};

export default Icon;
