import CTA from '@/components/Cta';
import { View, StyleSheet } from 'react-native';
import { bgDefault, STATUS_BAR_HEIGHT } from '@/theme';
import { useTheme } from '@/hooks/useTheme';
import { useNavigation } from '@react-navigation/native';

import { RootStackParamList } from '@/Navigation';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = useTheme() ?? 'light';
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <View style={[styles.container, bgDefault(theme)]}>
      <View style={styles.cta}>
        <CTA
          onPress={() => {
            navigation.navigate('Settings');
          }}
          disabled={false}
          icon="settings-outline"
          color="foreground"
        />
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: STATUS_BAR_HEIGHT,
    paddingHorizontal: 20,
  },
  cta: {
    position: 'absolute',
    top: STATUS_BAR_HEIGHT,
    right: 20,
  },
});
