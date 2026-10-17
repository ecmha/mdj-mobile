import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import DefaultLayout from '@/layouts/DefaultLayout';
import TopicCard from '@/components/TopicCard';
import Toast from '@/components/Toast';
import { useLanguage } from '@/hooks/useLanguage';
import { useTheme } from '@/hooks/useTheme';
import { colors } from '@/theme/variables/colors';
import { getTopics } from '@/services/topics';
import { Topic } from '@/services/topics/types';
import { topicColor } from './topics';
import EmptyTopics from './EmptyTopics';

// Grid of the topics messages are about, reached from the Menu.
export default function Topics() {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const theme = useTheme() ?? 'light';
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [failed, setFailed] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setTopics(await getTopics());
      setFailed(false);
    } catch {
      setFailed(true);
    }
  }, []);

  useEffect(() => {
    load().finally(() => setLoading(false));
  }, [load]);

  const refresh = useCallback(() => {
    setRefreshing(true);
    load().finally(() => setRefreshing(false));
  }, [load]);

  // No topic page yet: the server doesn't tag messages by topic.
  const openTopic = useCallback(
    () => setToastMessage(t('topics.unavailable')),
    [t],
  );

  const hideToast = useCallback(() => setToastMessage(null), []);

  // The server sends both languages, so a language change needs no refetch.
  const renderItem = useCallback(
    ({ item }: { item: Topic }) => (
      <TopicCard
        label={item.name[language]}
        color={topicColor(item._id)}
        cover={item.cover}
        onPress={openTopic}
      />
    ),
    [language, openTopic],
  );

  // Not scrollable through the layout: the toast must sit over the screen,
  // not at the end of the scroll content.
  return (
    <DefaultLayout pageTitle={t('topics.title')} scrollable={false}>
      {loading ? (
        <ActivityIndicator
          style={styles.loader}
          size="large"
          color={colors[theme].primary}
        />
      ) : (
        <FlatList
          data={topics}
          renderItem={renderItem}
          keyExtractor={topic => topic._id}
          numColumns={2}
          columnWrapperStyle={styles.column}
          contentContainerStyle={styles.grid}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={refresh} />
          }
          ListEmptyComponent={<EmptyTopics failed={failed} />}
        />
      )}
      <Toast message={toastMessage} onHide={hideToast} style={styles.toast} />
    </DefaultLayout>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexGrow: 1,
    // Row gap only: the column gutter is what `space-between` leaves.
    rowGap: 10,
    paddingVertical: 16,
    paddingBottom: 40,
  },
  column: {
    // Keeps a lone card on the last row at its own width instead of
    // centring or stretching it.
    justifyContent: 'space-between',
  },
  loader: {
    marginTop: 60,
  },
  toast: { bottom: 40 },
});
