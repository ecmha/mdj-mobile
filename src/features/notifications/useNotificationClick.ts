import { useCallback, useEffect } from 'react';
import { NotificationClickEvent, OneSignal } from 'react-native-onesignal';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { NotificationTypes, PushNotificationData } from './types';

const IS_DEV = __DEV__;

export const useNotificationClick = () => {
  const navigation = useNavigation<NavigationProp<any>>();

  const onNotificationClick = useCallback(
    (event: NotificationClickEvent) => {
      const { notification } = event;
      if (IS_DEV) {
        console.log('[OneSignal] Notification clicked:', notification.title);
      }
      const data = notification.additionalData as PushNotificationData;
      if (data?.type === NotificationTypes.NEW_DAILY_MEDITATION) {
        navigation.navigate('Home');
      }
    },
    [navigation],
  );

  useEffect(() => {
    OneSignal.Notifications.addEventListener('click', onNotificationClick);

    return () => {
      OneSignal.Notifications.removeEventListener('click', onNotificationClick);
    };
  }, [onNotificationClick]);
};
