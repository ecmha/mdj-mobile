import {
  View,
  StatusBar,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
import {
  alignItems,
  bgDefault,
  bgPrimary,
  flexContent,
  justifyContent,
  roundedLg,
  textColor,
  p,
  textAlign,
  fontFamily,
  textSmall,
  textLargeX1,
} from '@/theme';
import { useTheme } from '@/hooks/useTheme';
import MText from '@/components/Text';
import { useContext } from 'react';
import { WelcomeContext } from '@/contexts/welcomeProvider';
import { useNavigation } from '@/hooks/useNavigation';
import styles from './styles';
import { OneSignal } from 'react-native-onesignal';
import { registerDevice } from '@/services/devices';
import { useTranslation } from 'react-i18next';

export default function Welcome() {
  const theme = useTheme();
  const { t } = useTranslation();
  const { updateShowWelcome } = useContext(WelcomeContext);
  const navigation = useNavigation();

  const onStartApp = () => {
    updateShowWelcome(false);
    navigation.replace('Home');
    OneSignal.User.getOnesignalId().then(id => {
      if (id) {
        registerDevice({
          deviceId: id,
          platform: Platform.OS,
        });
      }
    });
  };

  return (
    <View style={[flexContent(1), bgDefault(theme), p(10)]}>
      <StatusBar
        barStyle={theme === 'dark' ? 'light-content' : 'dark-content'}
      />
      <View style={[flexContent(2), justifyContent.center, alignItems.center]}>
        <Image
          source={require('@/assets/imgs/app_logo.png')}
          style={styles.cover}
        />
      </View>
      <View
        style={[
          flexContent(1),
          alignItems.center,
          justifyContent.center,
          p(30),
        ]}
      >
        <MText
          style={[textAlign.center, fontFamily.cormorantBold, textLargeX1]}
        >
          {t('welcome.tagline')}
        </MText>
      </View>
      <View style={[flexContent(1), justifyContent.center, alignItems.center]}>
        <MText style={[fontFamily.sfRegular, textSmall, textAlign.center]}>
          {t('welcome.presented_by')}
          {`\n`}
          {t('welcome.church_name')}
          {`\n`}
          {t('welcome.church_subtitle')}
        </MText>
      </View>
      <View style={[flexContent(1), alignItems.center]}>
        <TouchableOpacity
          activeOpacity={0.7}
          style={[styles.button, bgPrimary(theme), roundedLg]}
          onPress={() => onStartApp()}
        >
          <MText style={[textColor('white'), fontFamily.sfBold]}>
            {t('welcome.cta')}
          </MText>
        </TouchableOpacity>
      </View>
    </View>
  );
}
