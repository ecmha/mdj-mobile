import { useCallback, useEffect, useRef, useState } from 'react';
import type { PanGesture } from 'react-native-gesture-handler';
import HomeLayout from './Shell';
import Carousel, {
  type ICarouselInstance,
} from 'react-native-reanimated-carousel';
import { DIMENSIONS } from '@/theme';
import { getDayMessages } from '@/services/messages';
import { Message } from '@/services/messages/types';
import EmptyList from './EmptyList';
import CarouselNav from './CarouselNav';
import MessageItem from '@/components/MessageItem';
import { useHomeTutorial } from '@/hooks/useHomeTutorial';
import { useLanguage } from '@/hooks/useLanguage';

// Tells the Carousel's pan gesture to yield on vertical movement so the inner
// ScrollView's RefreshControl can capture the pull-to-refresh gesture.
const configureCarouselPanGesture = (panGesture: PanGesture) => {
  panGesture.activeOffsetX([-10, 10]).failOffsetY([-5, 5]);
};

export default function Home() {
  const carouselRef = useRef<ICarouselInstance>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const { language } = useLanguage();
  const requestIdRef = useRef(0);
  const { dismiss: dismissTutorial } = useHomeTutorial();
  const [currentIndex, setCurrentIndex] = useState(0);
  // Per-slide "reader reached the bottom" flags — the nav buttons only show
  // once the message currently on screen has been read to the end.
  const [endReached, setEndReached] = useState<Record<number, boolean>>({});

  const handleSnapToItem = useCallback(
    (index: number) => {
      setCurrentIndex(index);
      if (index !== 0) dismissTutorial();
    },
    [dismissTutorial],
  );

  const handlePrevious = useCallback(() => {
    carouselRef.current?.prev();
  }, []);

  const handleNext = useCallback(() => {
    carouselRef.current?.next();
  }, []);

  const handleEndReachedChange = useCallback(
    (index: number, reached: boolean) => {
      setEndReached(previous =>
        previous[index] === reached
          ? previous
          : { ...previous, [index]: reached },
      );
    },
    [],
  );

  const getMedidations = useCallback(async () => {
    const requestId = ++requestIdRef.current;
    const dayMessages = await getDayMessages(language);
    if (requestId === requestIdRef.current) {
      setMessages(dayMessages);
      setCurrentIndex(0);
      setEndReached({});
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
            onEndReachedChange={reached =>
              handleEndReachedChange(index, reached)
            }
          />
        )}
      />
      <CarouselNav
        canGoPrevious={Boolean(endReached[currentIndex]) && currentIndex > 0}
        canGoNext={
          Boolean(endReached[currentIndex]) &&
          currentIndex < messages.length - 1
        }
        onPrevious={handlePrevious}
        onNext={handleNext}
      />
    </HomeLayout>
  );
}
