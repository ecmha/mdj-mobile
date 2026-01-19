import { View } from 'react-native';
import MText from '@/components/Text';
import { useEffect } from 'react';
import Storage from '@/lib/storage';
import PageLoader from '@/components/PageLoader';
import { useContext } from 'react';
import { WelcomeContext } from '@/contexts/welcomeProvider';
import { useNavigation } from '@/hooks/useNavigation';

export default function SplashScreen() {
  const { updateShowWelcome } = useContext(WelcomeContext);
  const navigation = useNavigation();
  useEffect(() => {
    Storage.retrieve(Storage.SHOW_WELCOME_KEY).then(res => {
      const showWelcome = JSON.parse(res || 'true');
      updateShowWelcome(showWelcome);
      navigation.replace('Home');
    });
  }, []);

  return <PageLoader />;
}
