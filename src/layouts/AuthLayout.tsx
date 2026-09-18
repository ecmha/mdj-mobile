import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import Icon from '@/components/Icon';
import MText from '@/components/Text';
import { useNavigation } from '@/hooks/useNavigation';
import { useTheme } from '@/hooks/useTheme';
import { bgDefault, fontFamily, mt, textAlign, textLargeX1 } from '@/theme';

// Login / Signup wrapper: back button, app logo and page title above a
// keyboard-aware form. `footer` stays pinned under the scrolling form.
export default function AuthLayout({
  title,
  children,
  footer,
}: {
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  const theme = useTheme() ?? 'light';
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  return (
    <View
      style={[
        styles.container,
        bgDefault(theme),
        { paddingTop: insets.top, paddingBottom: insets.bottom + 16 },
      ]}
    >
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle={theme === 'dark' ? 'light-content' : 'dark-content'}
      />
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
        accessibilityRole="button"
        accessibilityLabel={t('auth.back')}
      >
        <Icon name="arrow-back" color="default" size={25} />
      </TouchableOpacity>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Image
            source={require('@/assets/imgs/app_logo.png')}
            style={styles.logo}
          />
          <MText
            accessibilityRole="header"
            style={[
              fontFamily.cormorantBold,
              textLargeX1,
              textAlign.center,
              mt(16),
            ]}
          >
            {title}
          </MText>
          {children}
        </ScrollView>
        {footer ? <View style={styles.footer}>{footer}</View> : null}
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backButton: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  logo: {
    alignSelf: 'center',
    width: 200,
    height: 93,
    resizeMode: 'contain',
  },
  footer: {
    paddingHorizontal: 32,
    paddingTop: 12,
  },
});
