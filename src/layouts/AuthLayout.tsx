import {
  Image,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import Icon from '@/components/Icon';
import MText from '@/components/Text';
import { useNavigation } from '@/hooks/useNavigation';
import { useTheme } from '@/hooks/useTheme';
import { bgDefault, fontFamily, mt, textAlign, textLargeX1 } from '@/theme';

// Gap kept between the focused field and the top of the keyboard.
const KEYBOARD_GAP = 24;

// Login / Signup / ForgotPassword / ResetPassword wrapper: back button, app
// logo and page title above the form, with `footer` at the end of the content.
// KeyboardAwareScrollView (react-native-keyboard-controller) follows the
// keyboard natively and scrolls the focused field into view on both platforms.
export default function AuthLayout({
  title,
  children,
  footer,
  overlay,
}: {
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  // Rendered above the form, outside the scroll view (e.g. a BottomSheet).
  overlay?: React.ReactNode;
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
      <KeyboardAwareScrollView
        bottomOffset={KEYBOARD_GAP}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
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
        {/* In the scroll content, not pinned: pinned, the keyboard covers it. */}
        {footer ? <View style={styles.footer}>{footer}</View> : null}
      </KeyboardAwareScrollView>
      {overlay}
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
    flexGrow: 1,
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
    paddingHorizontal: 8,
    paddingTop: 24,
  },
});
