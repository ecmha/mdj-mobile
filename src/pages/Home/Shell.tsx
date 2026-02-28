import CTA from '@/components/Cta';
import { View, StyleSheet } from 'react-native';
import { bgDefault, flexContent, STATUS_BAR_HEIGHT } from '@/theme';
import { useTheme } from '@/hooks/useTheme';
import { useNavigation } from '@/hooks/useNavigation';
import { StatusBar } from 'react-native';
import { useNotificationClick } from '@/features/notifications/useNotificationClick';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useNotificationClick();
  const theme = useTheme() ?? 'light';
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, bgDefault(theme), { paddingBottom: insets.bottom }]}>
      <StatusBar
        barStyle={theme === 'dark' ? 'light-content' : 'dark-content'}
      />

      <View style={[flexContent(1)]}>{children}</View>

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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: STATUS_BAR_HEIGHT,
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
