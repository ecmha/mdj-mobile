import { View, StatusBar } from 'react-native';
import { alignItems, bgDefault, flexContent, justifyContent } from '@/theme';
import { useTheme } from '@/hooks/useTheme';
import MText from '@/components/Text';
import { useContext } from 'react';
import { WelcomeContext } from '@/contexts/welcomeProvider';

export default function Welcome() {
  const theme = useTheme();
  const { updateShowWelcome } = useContext(WelcomeContext);
  return (
    <View style={[flexContent(1), bgDefault(theme)]}>
      <StatusBar
        barStyle={theme === 'dark' ? 'light-content' : 'dark-content'}
      />
      <View style={[flexContent(1), justifyContent.center, alignItems.center]}>
        <MText>Bienvenue sur l'application</MText>
      </View>
    </View>
  );
}
