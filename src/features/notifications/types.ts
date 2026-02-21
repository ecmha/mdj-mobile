export enum NotificationTypes {
  NEW_DAILY_MEDITATION = 'new_daily_meditation',
  MEDITATION_REMINDER = 'meditation_reminder',
  MEDITATION_COMPLETED = 'meditation_completed',
}

export type PushNotificationData = {
  type?: string;
  messageId?: string;
};
