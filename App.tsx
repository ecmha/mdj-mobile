/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Navigation from './src/Navigation';
import { ThemeProvider } from './src/contexts/themeProvider';
import { useTheme } from '@/hooks/useTheme';

function App() {
  const theme = useTheme();
  const isDarkMode = theme === 'dark';

  return (
    <ThemeProvider>
      <SafeAreaProvider>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <Navigation />
      </SafeAreaProvider>
    </ThemeProvider>
  );
}

export default App;
