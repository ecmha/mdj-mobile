/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Navigation from './src/Navigation';
import { ThemeProvider } from './src/contexts/themeProvider';
import { WelcomeProvider } from './src/contexts/welcomeProvider';
import { LanguageProvider } from './src/contexts/languageProvider';
import { AudioPlayerProvider } from './src/contexts/audioPlayerProvider';
import { useOneSignalInit } from './src/features/notifications/useOneSignalInit';
import MiniPlayerBar from './src/components/AudioPlayer/MiniPlayerBar';

function App() {
  useOneSignalInit();
  return (
    <ThemeProvider>
      <SafeAreaProvider>
        <WelcomeProvider>
          <LanguageProvider>
            <AudioPlayerProvider>
              <View style={styles.root}>
                <Navigation />
                <MiniPlayerBar />
              </View>
            </AudioPlayerProvider>
          </LanguageProvider>
        </WelcomeProvider>
      </SafeAreaProvider>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});

export default App;
