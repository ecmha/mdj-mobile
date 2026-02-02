import { useCallback, useEffect } from 'react';
import { LogLevel, NotificationClickEvent, NotificationWillDisplayEvent, OneSignal } from 'react-native-onesignal';
import { ONE_SIGNAL_APP_ID } from '../config/app';
import { useFocusEffect } from '@react-navigation/native';

export const useOneSignalConfig = () => {
    const OSLog = useCallback((message: string, optionalArg: unknown = null) => {
        let logMessage = message;
        if (optionalArg !== null) {
            logMessage = message + JSON.stringify(optionalArg);
        }

        console.log(logMessage);

    }, []);

    const onForegroundWillDisplay = useCallback(
        (event: NotificationWillDisplayEvent) => {
            const notif = event.getNotification();
            OSLog('OneSignal: notification will show in foreground:', notif.title);
            console.log('Will display notification event:', notif);

            event.preventDefault();

            setTimeout(() => {
                notif.display();
            }, 5000);

            // const cancelButton = {
            //   text: 'Cancel',
            //   onPress: () => {
            //     (event as { preventDefault: () => void }).preventDefault();
            //   },
            //   style: 'cancel' as const,
            // };

            // const completeButton = {
            //   text: 'Display',
            //   onPress: () => {
            //     (event as { getNotification: () => { display: () => void } })
            //       .getNotification()
            //       .display();
            //   },
            // };

            // Alert.alert(
            //   'Display notification?',
            //   notif.title,
            //   [cancelButton, completeButton],
            //   {
            //     cancelable: true,
            //   },
            // );
        },
        [OSLog],
    );

    const onNotificationClick = useCallback(
        (event: NotificationClickEvent) => {
            const notif = event.notification;
            OSLog('OneSignal: notification clicked:', notif.title);
            console.log('Notification clicked event:', notif);
        },
        [OSLog],
    );

    const onSubscriptionChange = useCallback(
        (subscription: unknown) => {
            OSLog('OneSignal: subscription changed:', subscription);
        },
        [OSLog],
    );

    const onPermissionChange = useCallback(
        (granted: unknown) => {
            OSLog('OneSignal: permission changed:', granted);
        },
        [OSLog],
    );

    const onUserChange = useCallback(
        (event: unknown) => {
            OSLog('OneSignal: user changed: ', event);
        },
        [OSLog],
    );

    useEffect(() => {
        OneSignal.initialize(ONE_SIGNAL_APP_ID);
        OneSignal.Debug.setLogLevel(LogLevel.None);
        OneSignal.Notifications.requestPermission(true);
        OneSignal.User.pushSubscription.optIn();

        OneSignal.User.pushSubscription.getIdAsync().then((id) => {
            console.log('OneSignal: push subscription id:', id);
        });
    }, []);

    useEffect(
        useCallback(() => {
            console.log('Setting up event listeners');

            const setup = async () => {
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
            };

            setup();

            return () => {
                console.log('Cleaning up event listeners');

                // Clean up all event listeners
                OneSignal.Notifications.removeEventListener(
                    'foregroundWillDisplay',
                    onForegroundWillDisplay,
                );
                OneSignal.Notifications.removeEventListener(
                    'click',
                    onNotificationClick,
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
            onNotificationClick,
            onSubscriptionChange,
            onPermissionChange,
            onUserChange,
        ]),
    );

};