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
  mt,
  textLargeX1,
  textAlign,
  textMini,
  textLargeX3,
  fontFamily,
  justifyContent,
} from '@/theme';
import { getDayMessages } from '@/services/messages';
import { Message } from '@/services/messages/types';
import { ScrollView } from 'react-native-gesture-handler';
import RenderHTML from '@/components/RenderHTML';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/hooks/useLanguage';

export default function Home() {
  const carouselRef = useRef(null);
  const { t } = useTranslation();
  const { language } = useLanguage();
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
              <MText
                style={[
                  textLargeX1,
                  textAlign.center,
                  mt(20),
                  fontFamily.sfRegular,
                ]}
              >
                {t('home.daily_message')}
              </MText>
              <MText
                style={[
                  textMini,
                  textAlign.center,
                  mb(20),
                  fontFamily.sfRegular,
                ]}
              >
                {`${new Date(item.scheduledAt)
                  .toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })
                  .toUpperCase()}`}
              </MText>

              <MText
                style={[textLargeX3, textAlign.center, fontFamily.cormorant]}
              >{`${item.title}\n`}</MText>
              <RenderHTML html={item.content} />
              <View style={[mt(40), mb(100), justifyContent.center]}>
                <MText style={[textMedium, fontFamily.sfBold]}>
                  {t('home.by_author', {
                    name: `${item.author?.firstname || t('home.unknown_author')} ${item.author?.lastname || ''}`.trim(),
                  })}
                </MText>
              </View>
            </ScrollView>
          </View>
        )}
      />
    </HomeLayout>
  );
}
