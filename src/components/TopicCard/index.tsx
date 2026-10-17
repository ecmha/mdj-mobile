import { Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import { IconNameType } from '@/components/Icon';
import { fontFamily, textBig } from '@/theme';
import styles from './styles';

export type TopicCardProps = {
  label: string;
  icon: IconNameType;
  color: string;
  onPress: () => void;
};

// One topic tile: label at the bottom left, a tilted cover square peeking off
// the top right corner.
export default function TopicCard({
  label,
  icon,
  color,
  onPress,
}: TopicCardProps) {
  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: color }]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <View style={styles.cover}>
        {/* Plain Ionicons: the `Icon` wrapper only takes theme colors, and
            this one is white whatever the theme. */}
        <Ionicons name={icon} color="#ffffff" size={40} />
      </View>
      {/* Not MText: its theme color would lose against the vivid card. */}
      <Text style={[styles.label, textBig, fontFamily.sfBold]} numberOfLines={1}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}
