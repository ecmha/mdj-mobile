import { Image, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import { API_URL } from '@env';
import { fontFamily, textMedium } from '@/theme';
import styles from './styles';

export type TopicCardProps = {
  label: string;
  color: string;
  /** GridFS file id. A tag glyph stands in when the topic has no cover. */
  cover?: string;
  onPress: () => void;
};

// One topic tile: label at the bottom left, a tilted cover square peeking off
// the top right corner.
export default function TopicCard({
  label,
  color,
  cover,
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
        {cover ? (
          <Image
            source={{ uri: `${API_URL}/files/${cover}/view` }}
            style={styles.coverImage}
            resizeMode="cover"
          />
        ) : (
          // Plain Ionicons: the `Icon` wrapper only takes theme colors, and
          // this one is white whatever the theme.
          <Ionicons name="pricetag" color="#ffffff" size={28} />
        )}
      </View>
      {/* Not MText: its theme color would lose against the vivid card. */}
      <Text
        style={[styles.label, textMedium, fontFamily.sfBold]}
        numberOfLines={1}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}
