import { Image, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import MText from '@/components/Text';
import Button from '@/components/Button';
import BottomSheet from '@/components/BottomSheet';
import { useAuth } from '@/hooks/useAuth';
import { useNavigation } from '@/hooks/useNavigation';
import { useTheme } from '@/hooks/useTheme';
import {
  bgColor,
  fontFamily,
  mt,
  textAlign,
  textLargeX1,
  textSmall,
} from '@/theme';
import { colors } from '@/theme/variables/colors';
import styles from './styles';

// Sheet asking a guest to log in or sign up. Opened through
// `useAuth().requireAuth()` and closed once a session opens. It stays open
// underneath Login / Signup, so it is still there when the user comes back.
export default function AuthPromptModal() {
  const { promptVisible, closePrompt } = useAuth();
  const navigation = useNavigation();
  const theme = useTheme() ?? 'light';
  const { t } = useTranslation();

  return (
    <BottomSheet
      visible={promptVisible}
      onDismiss={closePrompt}
      dismissLabel={t('auth.prompt.close')}
    >
      <View style={styles.header}>
        <Image
          source={require('@/assets/imgs/app_logo.png')}
          style={styles.logo}
        />
        <MText
          accessibilityRole="header"
          style={[fontFamily.cormorantBold, textLargeX1, mt(12)]}
        >
          {t('auth.prompt.title')}
        </MText>
        <MText
          style={[fontFamily.sfRegular, textSmall, textAlign.center, mt(6)]}
        >
          {t('auth.prompt.description')}
        </MText>
      </View>
      <View>
        <Button
          label={t('auth.login.cta')}
          onPress={() => navigation.navigate('Login')}
        />
        <View style={[styles.separator, bgColor(colors[theme].divider)]} />
        <Button
          label={t('auth.signup.cta')}
          variant="outline"
          onPress={() => navigation.navigate('Signup')}
        />
      </View>
    </BottomSheet>
  );
}
