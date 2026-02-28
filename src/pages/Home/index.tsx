import { useCallback, useEffect, useRef, useState } from 'react';
import { RefreshControl, View } from 'react-native';
import MText from '@/components/Text';
import HomeLayout from './Shell';
import Carousel from 'react-native-reanimated-carousel';
import {
  DIMENSIONS,
  flexContent,
  px,
  textMedium,
  mb,
  NAVIGATION_BAR_HEIGHT,
  pb,
  mt,
  textLargeX1,
  textAlign,
  textMini,
  textLargeX3,
} from '@/theme';
import { getDayMessages } from '@/services/messages';
import { Message } from '@/services/messages/types';
import { ScrollView } from 'react-native-gesture-handler';
import RenderHTML from '@/components/RenderHTML';

export default function Home() {
  const carouselRef = useRef(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const getMedidations = useCallback(async () => {
    const dayMessages = await getDayMessages();
    console.log('dayMessages', dayMessages);
    setMessages(dayMessages);
  }, []);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await getMedidations();
    setRefreshing(false);
  }, [getMedidations]);

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
        pagingEnabled
        renderItem={({ item }) => (
          <View style={[flexContent(1), px(20)]}>
            <ScrollView
              style={[flexContent(1)]}
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={handleRefresh}
                />
              }
            >
              <MText style={[textLargeX1, textAlign.center, mt(20)]}>
                Message du jour
              </MText>
              <MText style={[textMini, textAlign.center, mb(20)]}>
                {`${new Date(item.scheduledAt)
                  .toLocaleDateString('fr-FR', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })
                  .toUpperCase()}`}
              </MText>

              <MText
                style={[textLargeX3, textAlign.center]}
              >{`${item.title}\n`}</MText>
              <RenderHTML html={item.content} />
              <View style={[mb(100), pb(NAVIGATION_BAR_HEIGHT)]}>
                <MText style={[textMedium]}>
                  {`\n\n${new Date(item.scheduledAt)
                    .toLocaleString('fr-FR', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })
                    .toUpperCase()}`}
                </MText>
                <MText style={[textMedium]}>
                  {`Par ${item.author?.firstname || 'Inconnu'} ${
                    item.author?.lastname || ''
                  }`}
                </MText>
              </View>
            </ScrollView>
          </View>
        )}
      />
    </HomeLayout>
  );
}
