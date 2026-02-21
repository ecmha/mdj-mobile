import { View, StyleSheet } from 'react-native';
import MText from '@/components/Text';

export default function EmptyList() {
  return (
    <View style={styles.container}>
      <MText style={styles.text}>No items yet</MText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    color: '#888',
  },
});
