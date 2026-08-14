import { useCallback, useEffect, useRef, useState } from 'react';
import type { PanGesture } from 'react-native-gesture-handler';
import HomeLayout from './Shell';
import Carousel from 'react-native-reanimated-carousel';
import { DIMENSIONS } from '@/theme';
import { getDayMessages } from '@/services/messages';
import { Message } from '@/services/messages/types';
import EmptyList from './EmptyList';
import MessageItem from '@/components/MessageItem';
import { useHomeTutorial } from '@/hooks/useHomeTutorial';
import { useLanguage } from '@/hooks/useLanguage';

// Tells the Carousel's pan gesture to yield on vertical movement so the inner
// ScrollView's RefreshControl can capture the pull-to-refresh gesture.
const configureCarouselPanGesture = (panGesture: PanGesture) => {
  panGesture.activeOffsetX([-10, 10]).failOffsetY([-5, 5]);
};

export default function Home() {
  const carouselRef = useRef(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const { language } = useLanguage();
  const requestIdRef = useRef(0);
  const { dismiss: dismissTutorial } = useHomeTutorial();

  const handleSnapToItem = useCallback(
    (index: number) => {
      if (index !== 0) dismissTutorial();
    },
    [dismissTutorial],
  );

  const getMedidations = useCallback(async () => {
    const requestId = ++requestIdRef.current;
    const dayMessages = await getDayMessages(language);
    if (requestId === requestIdRef.current) {
      setMessages(dayMessages);
    }
  }, [language]);

  const handleRefresh = useCallback(async () => {
    try {
      setRefreshing(true);
      await getMedidations();
    } catch {
    } finally {
      setRefreshing(false);
    }
  }, [getMedidations]);

  useEffect(() => {
    getMedidations();
  }, [getMedidations]);

  if (messages.length === 0) {
    return (
      <HomeLayout>
        <EmptyList refreshing={refreshing} onRefresh={handleRefresh} />
      </HomeLayout>
    );
  }

  return (
    <HomeLayout>
      <Carousel
        ref={carouselRef}
        width={DIMENSIONS.WINDOW_WIDTH}
        height={DIMENSIONS.WINDOW_HEIGHT}
        data={messages}
        loop={false}
        scrollAnimationDuration={1000}
        pagingEnabled
        onConfigurePanGesture={configureCarouselPanGesture}
        onSnapToItem={handleSnapToItem}
        renderItem={({ item, index }) => (
          <MessageItem
            item={item}
            refreshing={refreshing}
            onRefresh={handleRefresh}
            canHintSwipe={index === 0 && messages.length > 1}
          />
        )}
      />
    </HomeLayout>
  );
}
