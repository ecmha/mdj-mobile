/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import Navigation from './src/Navigation';
import { ThemeProvider } from './src/contexts/themeProvider';
import { WelcomeProvider } from './src/contexts/welcomeProvider';
import { LanguageProvider } from './src/contexts/languageProvider';
import { AudioPlayerProvider } from './src/contexts/audioPlayerProvider';
import { AuthProvider } from './src/contexts/authProvider';
import { useOneSignalInit } from './src/features/notifications/useOneSignalInit';

function App() {
  useOneSignalInit();
  return (
    // Outermost, as the library requires: it feeds the keyboard frame to every
    // KeyboardAwareScrollView below it.
    <KeyboardProvider>
      <ThemeProvider>
        <SafeAreaProvider>
          <WelcomeProvider>
            <LanguageProvider>
              <AuthProvider>
                <AudioPlayerProvider>
                  <View style={styles.root}>
                    <Navigation />
                  </View>
                </AudioPlayerProvider>
              </AuthProvider>
            </LanguageProvider>
          </WelcomeProvider>
        </SafeAreaProvider>
      </ThemeProvider>
    </KeyboardProvider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});

export default App;
