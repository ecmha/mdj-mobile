import { useCallback, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import DefaultLayout from '@/layouts/DefaultLayout';
import TopicCard from '@/components/TopicCard';
import Toast from '@/components/Toast';
import { TOPICS } from './topics';

// Grid of the topics messages are about, reached from the Menu.
export default function Topics() {
  const { t } = useTranslation();
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // No topic page yet: the server doesn't tag messages by topic.
  const openTopic = useCallback(
    () => setToastMessage(t('topics.unavailable')),
    [t],
  );

  const hideToast = useCallback(() => setToastMessage(null), []);

  // Not scrollable through the layout: the toast must sit over the screen,
  // not at the end of the scroll content.
  return (
    <DefaultLayout pageTitle={t('topics.title')} scrollable={false}>
      <ScrollView
        contentContainerStyle={styles.grid}
        showsVerticalScrollIndicator={false}
      >
        {TOPICS.map(topic => (
          <TopicCard
            key={topic.id}
            label={t(`topics.items.${topic.id}`)}
            icon={topic.icon}
            color={topic.color}
            onPress={openTopic}
          />
        ))}
      </ScrollView>
      <Toast message={toastMessage} onHide={hideToast} style={styles.toast} />
    </DefaultLayout>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    // Row gap only: the column gutter is what `space-between` leaves.
    justifyContent: 'space-between',
    rowGap: 10,
    paddingVertical: 16,
    paddingBottom: 40,
  },
  toast: { bottom: 40 },
});
