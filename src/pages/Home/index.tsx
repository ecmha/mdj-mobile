import { useCallback, useEffect, useRef, useState } from 'react';
import HomeLayout from './Shell';
import Carousel from 'react-native-reanimated-carousel';
import { DIMENSIONS } from '@/theme';
import { getDayMessages } from '@/services/messages';
import { Message } from '@/services/messages/types';
import EmptyList from './EmptyList';
import MessageItem from '@/components/MessageItem';

// Tells the Carousel's pan gesture handler to yield on vertical movement so
// the inner ScrollView's RefreshControl can capture the pull-to-refresh gesture.
const CAROUSEL_PAN_GESTURE_PROPS = {
  activeOffsetX: [-10, 10],
  failOffsetY: [-5, 5],
} as const;

export default function Home() {
  const carouselRef = useRef(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const getMedidations = useCallback(async () => {
    try {
      const dayMessages = await getDayMessages();
      setMessages(dayMessages);
    } catch (error) {
      throw error;
    }
  }, []);

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
        panGestureHandlerProps={CAROUSEL_PAN_GESTURE_PROPS}
        renderItem={({ item }) => (
          <MessageItem
            item={item}
            refreshing={refreshing}
            onRefresh={handleRefresh}
          />
        )}
      />
    </HomeLayout>
  );
}
