import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Home from './pages/Home';
import Settings from './pages/Settings';
import Supremat from './pages/Supremat';
import Menu from './pages/Menu';
import ThemeSetting from './pages/ThemeSetting';
import LanguageSetting from './pages/LanguageSetting';
import Suggestion from './pages/Suggestion';
import Welcome from './pages/Welcome';
import SplashScreen from './pages/Splashscreen';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import MyInformations from './pages/MyInformations';
import Bookmarks from './pages/Bookmarks';
import BookmarkMessage from './pages/BookmarkMessage';

export type RootStackParamList = {
  Home: undefined;
  Settings: undefined;
  Supremat: undefined;
  Menu: undefined;
  ThemeSetting: undefined;
  LanguageSetting: undefined;
  Suggestion: undefined;
  Welcome: undefined;
  SplashScreen: undefined;
  Login: undefined;
  Signup: undefined;
  ForgotPassword: { email?: string } | undefined;
  ResetPassword: { token: string };
  MyInformations: undefined;
  Bookmarks: undefined;
  // The title rides along so the header has something to show while the
  // bookmark is being fetched.
  BookmarkMessage: { bookmarkId: string; title?: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function Navigation() {
  return (
    <GestureHandlerRootView>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="SplashScreen" component={SplashScreen} />
          <Stack.Screen name="Welcome" component={Welcome} />
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
            name="Menu"
            component={Menu}
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
          <Stack.Screen
            name="Bookmarks"
            component={Bookmarks}
            options={{ animation: 'slide_from_left' }}
          />
          <Stack.Screen
            name="BookmarkMessage"
            component={BookmarkMessage}
            options={{ animation: 'slide_from_right' }}
          />
          <Stack.Screen
            name="Login"
            component={Login}
            options={{ animation: 'slide_from_bottom' }}
          />
          <Stack.Screen
            name="Signup"
            component={Signup}
            options={{ animation: 'slide_from_bottom' }}
          />
          <Stack.Screen
            name="ForgotPassword"
            component={ForgotPassword}
            options={{ animation: 'slide_from_right' }}
          />
          <Stack.Screen
            name="ResetPassword"
            component={ResetPassword}
            options={{ animation: 'slide_from_bottom' }}
          />
          <Stack.Screen
            name="MyInformations"
            component={MyInformations}
            options={{ animation: 'slide_from_left' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
