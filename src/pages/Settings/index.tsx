import DefaultLayout from '@/layouts/DefaultLayout';
import { View } from 'react-native';
import MText from '@/components/Text';
import { alignItems, my, fontFamily, textTiny } from '@/theme';
import { useTheme } from '@/hooks/useTheme';
import LinksGroup from '@/components/LinksGroup';
import { useNavigation } from '@/hooks/useNavigation';
import { useTranslation } from 'react-i18next';
import { APP_VERSION } from '@/config/app';

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
            onPress: () => {
              //TODO: open playstore
            },
          },
          {
            id: 'rate',
            icon: 'star-outline',
            label: t('settings.leave_review'),
            onPress: () => {
              //TODO: open playstore
            },
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
            onPress: () => {},
          },
          {
            id: 'terms',
            icon: 'document-text-outline',
            label: t('settings.terms'),
            onPress: () => {},
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
