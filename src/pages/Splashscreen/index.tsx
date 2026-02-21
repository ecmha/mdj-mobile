import { useEffect } from 'react';
import { retrieveItem, STORAGE_KEYS } from '@/lib/storage';
import PageLoader from '@/components/PageLoader';
import { useNavigation } from '@/hooks/useNavigation';

export default function SplashScreen() {
  const navigation = useNavigation();
  useEffect(() => {
    retrieveItem(STORAGE_KEYS.SHOW_WELCOME).then(res => {
      const showWelcome = JSON.parse(res || 'true');
      navigation.replace(showWelcome ? 'Welcome' : 'Home');
    });
  }, [navigation]);

  return <PageLoader />;
}
