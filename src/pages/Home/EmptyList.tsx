import { View, StyleSheet } from 'react-native';
import MText from '@/components/Text';
import { useTranslation } from 'react-i18next';

export default function EmptyList() {
  const { t } = useTranslation();
  return (
    <View style={styles.container}>
      <MText style={styles.text}>{t('home.empty')}</MText>
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
