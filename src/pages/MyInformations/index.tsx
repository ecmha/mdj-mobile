import { useCallback, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import DefaultLayout from '@/layouts/DefaultLayout';
import Icon from '@/components/Icon';
import MText from '@/components/Text';
import { useAuth } from '@/hooks/useAuth';
import { useNavigation } from '@/hooks/useNavigation';
import { useTheme } from '@/hooks/useTheme';
import {
  alignItems,
  bgLight,
  flexContent,
  fontFamily,
  mt,
  px,
  py,
  roundedXXXL,
  textAlign,
  textDanger,
  textDecorationLine,
  textLargeX1,
  textPrimary,
  textSmall,
} from '@/theme';
import LogoutConfirmModal from './LogoutConfirmModal';

// Signed-in reader's account. Reached from Settings through requireAuth(), so
// `user` is set; the guard only covers a logout while the page is open.
export default function MyInformations() {
  const { t } = useTranslation();
  const theme = useTheme() ?? 'light';
  const navigation = useNavigation();
  const { user, logout } = useAuth();
  const [confirmVisible, setConfirmVisible] = useState(false);

  const handleLogout = useCallback(() => {
    setConfirmVisible(false);
    logout();
    // Back to Settings: this page has nothing left to show once the session
    // is gone, and its own `!user` guard would blank it.
    navigation.goBack();
  }, [logout, navigation]);

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

        {/* The email is the account's identity here, so it gets a pill of
            its own rather than a plain line of text. */}
        <View
          style={[
            styles.emailPill,
            bgLight(theme),
            roundedXXXL,
            px(16),
            py(10),
            mt(14),
          ]}
        >
          <Icon name="mail-outline" color="primary" size={16} />
          <MText
            style={[
              textSmall,
              fontFamily.sfBold,
              textPrimary(theme),
              styles.email,
            ]}
            numberOfLines={1}
          >
            {user.email}
          </MText>
        </View>
      </View>

      {/* Eats the space between the identity block and the link, so the
          link lands at the bottom of the screen however short the page is. */}
      <View style={flexContent(1)} />

      <TouchableOpacity
        onPress={() => setConfirmVisible(true)}
        style={[alignItems.center, styles.logout]}
        accessibilityRole="button"
      >
        <MText
          style={[
            textSmall,
            fontFamily.sfBold,
            textDanger(theme),
            textDecorationLine.underline,
          ]}
        >
          {t('my_informations.logout')}
        </MText>
      </TouchableOpacity>

      <LogoutConfirmModal
        visible={confirmVisible}
        onCancel={() => setConfirmVisible(false)}
        onConfirm={handleLogout}
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
  emailPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    maxWidth: '90%',
  },
  email: {
    letterSpacing: 0.3,
  },
  // Kept clear of the very edge, above the layout's bottom spacer.
  logout: {
    marginTop: 40,
    marginBottom: 8,
  },
});
