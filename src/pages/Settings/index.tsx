import DefaultLayout from '@/layouts/DefaultLayout';
import { Linking, Platform, Share, View } from 'react-native';
import MText from '@/components/Text';
import { alignItems, my, fontFamily, textTiny } from '@/theme';
import { useTheme } from '@/hooks/useTheme';
import LinksGroup from '@/components/LinksGroup';
import { useNavigation } from '@/hooks/useNavigation';
import { useTranslation } from 'react-i18next';
import {
  APP_VERSION,
  APP_STORE_URL,
  PLAY_STORE_URL,
  PRIVACY_POLICY_URL,
  TERMS_OF_USE_URL,
  getStoreUrl,
} from '@/config/app';

const handleShareApp = () => {
  const url = getStoreUrl();
  Share.share(
    { message: url, url },
    { dialogTitle: 'MDJ' },
  );
};

const handleLeaveReview = async () => {
  if (Platform.OS === 'android') {
    const marketUrl = `market://details?id=com.brankoo.mdj`;
    const supported = await Linking.canOpenURL(marketUrl);
    Linking.openURL(supported ? marketUrl : PLAY_STORE_URL);
  } else {
    const itmsUrl = APP_STORE_URL.replace('https://', 'itms-apps://');
    const supported = await Linking.canOpenURL(itmsUrl);
    Linking.openURL(supported ? itmsUrl : APP_STORE_URL);
  }
};

export default function Settings() {
  const theme = useTheme() ?? 'light';
  const navigation = useNavigation();
  const { t } = useTranslation();
  return (
    <DefaultLayout pageTitle={t('settings.title')}>
      <LinksGroup
        header={t('settings.section_customize')}
        links={[
          {
            id: 'language',
            icon: 'language-outline',
            label: t('settings.language'),
            onPress: () => {
              navigation.navigate('LanguageSetting');
            },
          },
          {
            id: 'theme',
            icon: theme === 'light' ? 'moon-outline' : 'sunny-outline',
            label: t('settings.theme'),
            onPress: () => {
              navigation.navigate('ThemeSetting');
            },
          },
        ]}
      />
      <LinksGroup
        header={t('settings.section_support')}
        links={[
          {
            id: 'share',
            icon: 'share-social-outline',
            label: t('settings.share_app'),
            onPress: handleShareApp,
          },
          {
            id: 'rate',
            icon: 'star-outline',
            label: t('settings.leave_review'),
            onPress: handleLeaveReview,
          },
          {
            id: 'suggestion',
            icon: 'chatbubble-ellipses-outline',
            label: t('settings.make_suggestion'),
            onPress: () => {
              navigation.navigate('Suggestion');
            },
          },
          // {
          //   id: 'donate',
          //   icon: 'gift-outline',
          //   label: t('settings.donate'),
          //   onPress: () => {
          //     //TODO: open playstore
          //   },
          // },
        ]}
      />
      <LinksGroup
        header={t('settings.section_follow')}
        links={[
          {
            id: 'twitter',
            icon: 'logo-twitter',
            label: t('settings.twitter'),
            onPress: () => {},
          },
          {
            id: 'facebook',
            icon: 'logo-facebook',
            label: t('settings.facebook'),
            onPress: () => {},
          },
        ]}
      />
      <LinksGroup
        header={t('settings.section_other')}
        links={[
          {
            id: 'privacy',
            icon: 'lock-closed-outline',
            label: t('settings.privacy_policy'),
            onPress: () => Linking.openURL(PRIVACY_POLICY_URL),
          },
          {
            id: 'terms',
            icon: 'document-text-outline',
            label: t('settings.terms'),
            onPress: () => Linking.openURL(TERMS_OF_USE_URL),
          },
        ]}
      />
      <View style={[my(20), alignItems.center]}>
        <MText style={[textTiny, fontFamily.sfBold]}>
          {t('settings.version', { version: APP_VERSION })}
        </MText>
      </View>
    </DefaultLayout>
  );
}
