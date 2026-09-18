import { View, StyleSheet, StatusBar, Image } from 'react-native';
import CTA from '@/components/Cta';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { bgDefault, flexContent, STATUS_BAR_HEIGHT } from '@/theme';
import { useTheme } from '@/hooks/useTheme';
import { useNavigation } from '@/hooks/useNavigation';
import { useNotificationClick } from '@/features/notifications/useNotificationClick';
import { usePasswordResetLink } from '@/features/auth/usePasswordResetLink';
import Icon from '@/components/Icon';
import AuthPromptModal from '@/components/AuthPromptModal';

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useNotificationClick();
  usePasswordResetLink();
  const theme = useTheme() ?? 'light';
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        bgDefault(theme),
        { paddingBottom: insets.bottom },
      ]}
    >
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle={theme === 'dark' ? 'light-content' : 'dark-content'}
      />

      <View style={[flexContent(1)]}>{children}</View>

      <View style={styles.ctaRight}>
        <CTA
          onPress={() => {
            navigation.navigate('Settings');
          }}
          disabled={false}
          color="foreground"
        >
          <Icon name="settings-outline" color="foreground" size={25} />
        </CTA>
      </View>
      <View style={styles.ctaLeft}>
        <CTA
          onPress={() => {
            navigation.navigate('Supremat');
          }}
          disabled={false}
          color="foreground"
        >
          <Image
            source={require('@/assets/imgs/app_icon.png')}
            style={styles.appIcon}
          />
        </CTA>
      </View>
      <AuthPromptModal />
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
  appIcon: { width: 30, height: 30 },
});
