import CTA from '@/components/Cta';
import { View, StyleSheet } from 'react-native';
import { bgDefault, STATUS_BAR_HEIGHT } from '@/theme';
import { useTheme } from '@/hooks/useTheme';
import { useNavigation } from '@react-navigation/native';

import { RootStackParamList } from '@/Navigation';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StatusBar } from 'react-native';

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = useTheme() ?? 'light';
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <View style={[styles.container, bgDefault(theme)]}>
      <StatusBar
        barStyle={theme === 'dark' ? 'light-content' : 'dark-content'}
      />

      <View style={styles.ctaRight}>
        <CTA
          onPress={() => {
            navigation.navigate('Settings');
          }}
          disabled={false}
          icon="settings-outline"
          color="foreground"
        />
      </View>
      <View style={styles.ctaLeft}>
        <CTA
          onPress={() => {
            navigation.navigate('Supremat');
          }}
          disabled={false}
          icon="information-outline"
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
  ctaRight: {
    position: 'absolute',
    top: STATUS_BAR_HEIGHT,
    right: 20,
  },
  ctaLeft: {
    position: 'absolute',
    top: STATUS_BAR_HEIGHT,
    left: 20,
  },
});
