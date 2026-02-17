import { useCallback, useEffect, useRef } from 'react';
import {
  NotificationClickEvent,
  NotificationWillDisplayEvent,
  OneSignal,
} from 'react-native-onesignal';
import { ONE_SIGNAL_APP_ID } from '../config/app';

// Configuration constants
const FOREGROUND_NOTIFICATION_DELAY_MS = 5000;
const IS_DEV = __DEV__;

export const useOneSignalConfig = () => {
  const isInitializedRef = useRef(false);

  // Handle foreground notifications with delay
  const onForegroundWillDisplay = useCallback(
    (event: NotificationWillDisplayEvent) => {
      const notif = event.getNotification();

      if (IS_DEV) {
        console.log('[OneSignal] Foreground notification:', notif.title);
      }

      event.preventDefault();

      // Display notification after delay
      setTimeout(() => {
        notif.display();
      }, FOREGROUND_NOTIFICATION_DELAY_MS);
    },
    [],
  );

  // Handle notification clicks
  const onNotificationClick = useCallback((event: NotificationClickEvent) => {
    const { notification } = event;
    if (IS_DEV) {
      console.log('[OneSignal] Notification clicked:', notification.title);
    }
    // Handle navigation or app logic based on notification data
  }, []);

  // Handle subscription changes (e.g., when push token updates)
  const onSubscriptionChange = useCallback((event: any) => {
    if (IS_DEV) {
      console.log('[OneSignal] Subscription changed:', event);
    }
  }, []);

  // Handle permission changes
  const onPermissionChange = useCallback((granted: boolean) => {
    if (IS_DEV) {
      console.log('[OneSignal] Permission changed:', granted);
    }
  }, []);

  // Handle user changes
  const onUserChange = useCallback((event: any) => {
    if (IS_DEV) {
      console.log('[OneSignal] User changed:', event);
    }
  }, []);

  // Initialize OneSignal (runs once)
  useEffect(() => {
    if (isInitializedRef.current) return;

    try {
      OneSignal.initialize(ONE_SIGNAL_APP_ID);

      // Request notification permissions
      OneSignal.Notifications.requestPermission(true);

      isInitializedRef.current = true;

      if (IS_DEV) {
        console.log('[OneSignal] Initialized successfully');
      }
    } catch (error) {
      console.error('[OneSignal] Initialization failed:', error);
    }
  }, []);

  // Register event listeners (runs once)
  useEffect(() => {
    if (!isInitializedRef.current) return;

    OneSignal.Notifications.addEventListener(
      'foregroundWillDisplay',
      onForegroundWillDisplay,
    );
    OneSignal.Notifications.addEventListener('click', onNotificationClick);
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
      OneSignal.Notifications.removeEventListener('click', onNotificationClick);
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
    onNotificationClick,
    onSubscriptionChange,
    onPermissionChange,
    onUserChange,
  ]);
};
