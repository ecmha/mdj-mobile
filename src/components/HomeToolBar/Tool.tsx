import { TouchableOpacity } from 'react-native';
import Icon, { IconNameType } from '../Icon';
import styles from './styles';

type HomeToolProps = {
  onPress: () => void;
  accessibilityLabel: string;
  icon: IconNameType;
  customStyles?: object;
};

export default function HomeTool({
  onPress,
  accessibilityLabel,
  icon,
  customStyles,
}: HomeToolProps) {
  return (
    <TouchableOpacity
      style={[styles.button, customStyles]}
      onPress={onPress}
      accessibilityLabel={accessibilityLabel}
    >
      <Icon name={icon} color="foreground" size={25} />
    </TouchableOpacity>
  );
}
