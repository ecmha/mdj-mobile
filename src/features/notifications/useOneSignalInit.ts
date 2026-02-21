import { useCallback, useEffect, useRef } from 'react';
import {
  NotificationWillDisplayEvent,
  OneSignal,
} from 'react-native-onesignal';
import { ONE_SIGNAL_APP_ID } from '@/config/app';

const FOREGROUND_NOTIFICATION_DELAY_MS = 5000;
const IS_DEV = __DEV__;

export const useOneSignalInit = () => {
  const isInitializedRef = useRef(false);

  const onForegroundWillDisplay = useCallback(
    (event: NotificationWillDisplayEvent) => {
      const notif = event.getNotification();

      if (IS_DEV) {
        console.log('[OneSignal] Foreground notification:', notif.title);
      }

      event.preventDefault();

      setTimeout(() => {
        notif.display();
      }, FOREGROUND_NOTIFICATION_DELAY_MS);
    },
    [],
  );

  const onSubscriptionChange = useCallback((event: any) => {
    if (IS_DEV) {
      console.log('[OneSignal] Subscription changed:', event);
    }
  }, []);

  const onPermissionChange = useCallback((granted: boolean) => {
    if (IS_DEV) {
      console.log('[OneSignal] Permission changed:', granted);
    }
  }, []);

  const onUserChange = useCallback((event: any) => {
    if (IS_DEV) {
      console.log('[OneSignal] User changed:', event);
    }
  }, []);

  useEffect(() => {
    if (isInitializedRef.current) return;

    try {
      OneSignal.initialize(ONE_SIGNAL_APP_ID);
      OneSignal.Notifications.requestPermission(true);
      isInitializedRef.current = true;

      if (IS_DEV) {
        console.log('[OneSignal] Initialized successfully');
      }
    } catch (error) {
      console.error('[OneSignal] Initialization failed:', error);
    }
  }, []);

  useEffect(() => {
    if (!isInitializedRef.current) return;

    OneSignal.Notifications.addEventListener(
      'foregroundWillDisplay',
      onForegroundWillDisplay,
    );
    OneSignal.User.pushSubscription.addEventListener(
      'change',
      onSubscriptionChange,
    );
    OneSignal.Notifications.addEventListener(
      'permissionChange',
      onPermissionChange,
    );
    OneSignal.User.addEventListener('change', onUserChange);

    return () => {
      OneSignal.Notifications.removeEventListener(
        'foregroundWillDisplay',
        onForegroundWillDisplay,
      );
      OneSignal.User.pushSubscription.removeEventListener(
        'change',
        onSubscriptionChange,
      );
      OneSignal.Notifications.removeEventListener(
        'permissionChange',
        onPermissionChange,
      );
      OneSignal.User.removeEventListener('change', onUserChange);
    };
  }, [
    onForegroundWillDisplay,
    onSubscriptionChange,
    onPermissionChange,
    onUserChange,
  ]);
};
