import { useCallback, useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import MText from '@/components/Text';
import HomeLayout from './Shell';
import Carousel from 'react-native-reanimated-carousel';
import { DIMENSIONS, flexContent, p, textMedium } from '@/theme';
import { getDayMessages } from '@/services/messages';
import { Message } from '@/services/messages/types';

export default function Home() {
  const carouselRef = useRef(null);
  const [messages, setMessages] = useState<Message[]>([]);

  const getMedidations = useCallback(async () => {
    const dayMessages = await getDayMessages();
    console.log('dayMessages', dayMessages);
    setMessages(dayMessages);
  }, []);

  useEffect(() => {
    getMedidations();
  }, [getMedidations]);

  return (
    <HomeLayout>
      <Carousel
        ref={carouselRef}
        width={DIMENSIONS.WINDOW_WIDTH}
        height={DIMENSIONS.WINDOW_HEIGHT}
        data={messages}
        loop={false}
        scrollAnimationDuration={1000}
        renderItem={({ item }) => (
          <View style={[flexContent(1), p(20)]}>
            <MText style={[textMedium]}>{`${item.content}`}</MText>
          </View>
        )}
      />
    </HomeLayout>
  );
}
