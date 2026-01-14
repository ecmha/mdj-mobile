import { useTheme } from '@/hooks/useTheme';
import { textColorDefault } from '@/theme';
import { Text, TextProps } from 'react-native';

const MText = (props: TextProps) => {
  const theme = useTheme();
  return <Text {...props} style={[textColorDefault(theme), props.style]} />;
};

export default MText;
