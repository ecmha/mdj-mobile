/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import { setupAudio } from './src/services/audio';

AppRegistry.registerComponent(appName, () => App);

// Outside the React lifecycle on purpose — audio playback and its event
// listeners must survive components unmounting when the app is backgrounded.
setupAudio();
