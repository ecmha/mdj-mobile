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
import { useOneSignalConfig } from './src/hooks/useOneSignalConfig';

function App() {
  useOneSignalConfig();
  return (
    <ThemeProvider>
      <SafeAreaProvider>
        <WelcomeProvider>
          <Navigation />
        </WelcomeProvider>
      </SafeAreaProvider>
    </ThemeProvider>
  );
}

export default App;
