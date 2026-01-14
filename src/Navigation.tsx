import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './pages/Home';
import Settings from './pages/Settings';
import Supremat from './pages/Supremat';
import ThemeSetting from './pages/ThemeSetting';
import LanguageSetting from './pages/LanguageSetting';

export type RootStackParamList = {
  Home: undefined;
  Settings: undefined;
  Supremat: undefined;
  ThemeSetting: undefined;
  LanguageSetting: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={Home} />
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
      </Stack.Navigator>
    </NavigationContainer>
  );
}
