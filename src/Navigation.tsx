import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './pages/Home';
import Settings from './pages/Settings';
import Supremat from './pages/Supremat';
import ThemeSetting from './pages/ThemeSetting';
import LanguageSetting from './pages/LanguageSetting';
import Suggestion from './pages/Suggestion';
import Welcome from './pages/Welcome';
import SplashScreen from './pages/Splashscreen';
import { useContext } from 'react';
import { WelcomeContext } from './contexts/welcomeProvider';

export type RootStackParamList = {
  Home: undefined;
  Settings: undefined;
  Supremat: undefined;
  ThemeSetting: undefined;
  LanguageSetting: undefined;
  Suggestion: undefined;
  Welcome: undefined;
  SplashScreen: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function Navigation() {
  const { showWelcome } = useContext(WelcomeContext);
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="SplashScreen" component={SplashScreen} />
        <Stack.Screen name="Home" component={showWelcome ? Welcome : Home} />
        <Stack.Screen
          name="Settings"
          component={Settings}
          options={{ animation: 'slide_from_bottom' }}
        />
        <Stack.Screen
          name="Supremat"
          component={Supremat}
          options={{ animation: 'slide_from_left' }}
        />
        <Stack.Screen
          name="ThemeSetting"
          component={ThemeSetting}
          options={{ animation: 'slide_from_left' }}
        />
        <Stack.Screen
          name="LanguageSetting"
          component={LanguageSetting}
          options={{ animation: 'slide_from_left' }}
        />
        <Stack.Screen
          name="Suggestion"
          component={Suggestion}
          options={{ animation: 'slide_from_left' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
