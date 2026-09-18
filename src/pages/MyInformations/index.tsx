import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import DefaultLayout from '@/layouts/DefaultLayout';
import Button from '@/components/Button';
import Icon from '@/components/Icon';
import MText from '@/components/Text';
import { useAuth } from '@/hooks/useAuth';
import { useNavigation } from '@/hooks/useNavigation';
import { useTheme } from '@/hooks/useTheme';
import {
  alignItems,
  bgLight,
  fontFamily,
  mt,
  textAlign,
  textLargeX1,
} from '@/theme';

// Signed-in reader's account. Reached from Settings through requireAuth(), so
// `user` is set; the guard only covers a logout while the page is open.
export default function MyInformations() {
  const { t } = useTranslation();
  const theme = useTheme() ?? 'light';
  const navigation = useNavigation();
  const { user } = useAuth();

  if (!user) return null;

  return (
    <DefaultLayout pageTitle={t('my_informations.title')}>
      <View style={[alignItems.center, mt(40)]}>
        <View
          style={[styles.avatar, bgLight(theme)]}
          accessibilityRole="image"
          accessibilityLabel={t('my_informations.avatar')}
        >
          <Icon name="person" color="foreground" size={56} />
        </View>
        <MText
          style={[
            fontFamily.cormorantBold,
            textLargeX1,
            textAlign.center,
            mt(16),
          ]}
        >
          {`${user.firstname} ${user.lastname}`}
        </MText>
      </View>
      {/* Reuses the emailed reset link: the app has no authenticated
          change-password screen yet. */}
      <Button
        label={t('my_informations.change_password')}
        variant="outline"
        onPress={() =>
          navigation.navigate('ForgotPassword', { email: user.email })
        }
        style={mt(40)}
      />
    </DefaultLayout>
  );
}

const styles = StyleSheet.create({
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
