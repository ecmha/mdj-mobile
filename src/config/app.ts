import { Platform } from 'react-native';

export const APP_NAME = 'MDJ';
export const APP_VERSION = '1.0.2';

export const PRIVACY_POLICY_URL = 'https://mdj.brankoostudio.com/privacy.html';
export const TERMS_OF_USE_URL = 'https://mdj.brankoostudio.com/cgu.html';

const ANDROID_PACKAGE_NAME = 'com.brankoo.mdj';
// Fill in once the app is published on the App Store
const IOS_APP_ID = '';

export const PLAY_STORE_URL = `https://play.google.com/store/apps/details?id=${ANDROID_PACKAGE_NAME}`;
export const APP_STORE_URL = `https://apps.apple.com/app/id${IOS_APP_ID}`;

export const getStoreUrl = () =>
  Platform.OS === 'ios' ? APP_STORE_URL : PLAY_STORE_URL;
