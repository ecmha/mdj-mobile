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
} from '@/theme';
import { useTheme } from '@/hooks/useTheme';
import MText from '@/components/Text';
import { useContext } from 'react';
import { WelcomeContext } from '@/contexts/welcomeProvider';
import styles from './styles';
import { OneSignal } from 'react-native-onesignal';
import DeviceService from '@/services/devices';

export default function Welcome() {
  const theme = useTheme();
  const { updateShowWelcome } = useContext(WelcomeContext);

  const onStartApp = () => {
    updateShowWelcome(false);
    OneSignal.User.getOnesignalId().then(id => {
      if (id) {
        DeviceService.registerDevice({
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
      <View style={[flexContent(1), justifyContent.center, alignItems.center]}>
        <MText style={[styles.title]}>Bienvenue sur MDJ</MText>
      </View>
      <View style={[flexContent(2), justifyContent.center, alignItems.center]}>
        <Image
          source={require('@/assets/imgs/welcome.png')}
          style={{ width: 200, height: 200 }}
        />
      </View>
      <View style={[flexContent(1), alignItems.center, p(10)]}>
        <MText style={[textAlign.center, { fontWeight: 'bold' }]}>
          Votre outils de communion quotidienne avec le Seigneur Jesus-Christ
        </MText>
      </View>
      <View style={[flexContent(1), justifyContent.center, alignItems.center]}>
        <MText>Proposée par l'ECMHA</MText>
        <MText>Eglise du Christ - Mission Harris</MText>
        <MText>dite Eglise Harriste</MText>
      </View>
      <View style={[flexContent(1), alignItems.center]}>
        <TouchableOpacity
          activeOpacity={0.7}
          style={[styles.button, bgPrimary(theme), roundedLg]}
          onPress={() => onStartApp()}
        >
          <MText style={[textColor('white')]}>Commencer</MText>
        </TouchableOpacity>
      </View>
    </View>
  );
}
