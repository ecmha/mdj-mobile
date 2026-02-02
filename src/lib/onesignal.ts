import { ONE_SIGNAL_APP_ID } from "../config/app";
import { OneSignal } from "react-native-onesignal";

export function initOneSignal() {
    OneSignal.initialize(ONE_SIGNAL_APP_ID);
    OneSignal.Notifications.requestPermission(true);
}

export function setNotificationsEvents() {
    OneSignal.Notifications.addEventListener("click", (event: any) => {
        console.log("Notification opened", event);
    });
    OneSignal.Notifications.addEventListener("foregroundWillDisplay", (event: any) => {
        console.log("Notification will show in foreground", event);

        // Uncomment to prevent the notification from being displayed while in the foreground
        // event.preventDefault();
    });
}