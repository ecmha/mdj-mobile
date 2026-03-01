/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { SafeAreaProvider } from 'react-native-safe-area-context';
import Navigation from './src/Navigation';
import { ThemeProvider } from './src/contexts/themeProvider';
import { WelcomeProvider } from './src/contexts/welcomeProvider';
import { LanguageProvider } from './src/contexts/languageProvider';
import { useOneSignalInit } from './src/features/notifications/useOneSignalInit';

function App() {
  useOneSignalInit();
  return (
    <ThemeProvider>
      <SafeAreaProvider>
        <WelcomeProvider>
          <LanguageProvider>
            <Navigation />
          </LanguageProvider>
        </WelcomeProvider>
      </SafeAreaProvider>
    </ThemeProvider>
  );
}

export default App;
