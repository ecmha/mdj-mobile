import { useEffect } from 'react';
import { Linking } from 'react-native';
import { useNavigation } from '@/hooks/useNavigation';
import { parseResetToken } from './resetLink';

// getInitialURL() keeps returning the launch URL for the life of the process,
// and Home can mount more than once (Header's "back to home" resets the
// stack), so the launch link is only handled the first time.
let launchUrlHandled = false;

// Opens ResetPassword for a reset deep link, whether it launched the app or
// arrived while it was running. Mounted in HomeLayout: Home stays at the
// bottom of the stack, so this listens from every screen after onboarding.
export function usePasswordResetLink() {
  const navigation = useNavigation();

  useEffect(() => {
    const open = (url: string | null) => {
      const token = parseResetToken(url);
      if (token) navigation.navigate('ResetPassword', { token });
    };

    if (!launchUrlHandled) {
      launchUrlHandled = true;
      Linking.getInitialURL()
        .then(open)
        .catch(() => {});
    }
    const subscription = Linking.addEventListener('url', ({ url }) =>
      open(url),
    );
    return () => subscription.remove();
  }, [navigation]);
}
