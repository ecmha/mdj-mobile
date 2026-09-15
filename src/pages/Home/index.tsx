import { useState, useCallback, useEffect, JSX, useRef } from 'react';
import { StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import HomeLayout from '@/layouts/HomeLayout';
import HomeToolBar from '@/components/HomeToolBar';
import { HOME_TOOLBAR_HEIGHT } from '@/components/HomeToolBar/styles';
import Toast from '@/components/Toast';
import { useLanguage } from '@/hooks/useLanguage';
import { Message } from '@/services/messages/types';
import { getDayMessages } from '@/services/messages';
import MessageItem from '@/components/MessageItem/index';
import { TabView, SceneMap } from 'react-native-tab-view';

import EmptyList from './EmptyList';

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const requestIdRef = useRef(0);
  const { language } = useLanguage();
  const { t } = useTranslation();

  const getMedidations = useCallback(async () => {
    try {
      const requestId = ++requestIdRef.current;
      setRefreshing(true);
      const dayMessages = await getDayMessages(language);
      if (requestId === requestIdRef.current) {
        setMessages(dayMessages);
        setCurrentIndex(0);
      }
    } catch {
    } finally {
      setRefreshing(false);
    }
  }, [language]);

  useEffect(() => {
    getMedidations();
  }, [getMedidations]);

  const handleRefresh = useCallback(async () => {
    try {
      await getMedidations();
    } catch {}
  }, [getMedidations]);

  const handlePrevious = useCallback(() => {
    setCurrentIndex(prevIndex => Math.max(0, prevIndex - 1));
  }, []);

  const handleNext = useCallback(() => {
    setCurrentIndex(prevIndex => Math.min(messages.length - 1, prevIndex + 1));
  }, [messages.length]);

  // Bookmarks aren't implemented yet — tell the reader instead of doing nothing.
  const handleBookmark = useCallback(() => {
    setToastMessage(t('home.bookmark.unavailable'));
  }, [t]);

  const hideToast = useCallback(() => setToastMessage(null), []);

  if (messages.length === 0) {
    return (
      <HomeLayout>
        <EmptyList refreshing={refreshing} onRefresh={handleRefresh} />
      </HomeLayout>
    );
  }

  return (
    <HomeLayout>
      <TabView
        renderTabBar={() => null}
        navigationState={{
          index: currentIndex,
          routes: messages.map((message, index) => ({
            key: message.id,
            title: `Message ${index + 1}`,
          })),
        }}
        renderScene={SceneMap(
          messages.reduce((scenes, message) => {
            scenes[message.id] = () => (
              <MessageItem
                item={message}
                refreshing={refreshing}
                onRefresh={handleRefresh}
              />
            );
            return scenes;
          }, {} as Record<string, () => JSX.Element>),
        )}
        onIndexChange={(index: number) => {
          setCurrentIndex(index);
        }}
      />
      <HomeToolBar
        canGoPrevious={currentIndex > 0}
        canGoNext={currentIndex < messages.length - 1}
        onPrevious={handlePrevious}
        onNext={handleNext}
        message={messages[currentIndex]}
        onBookmark={handleBookmark}
      />
      <Toast message={toastMessage} onHide={hideToast} style={styles.toast} />
    </HomeLayout>
  );
}

const styles = StyleSheet.create({
  toast: { bottom: HOME_TOOLBAR_HEIGHT + 12 },
});
