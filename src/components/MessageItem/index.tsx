import { useCallback, useRef } from 'react';
import {
  Image,
  LayoutChangeEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
  RefreshControl,
  Share,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { API_URL } from '@env';
import { WEBSITE_URL } from '@/config/app';
import MText from '@/components/Text';
import Icon from '@/components/Icon';
import CTA from '@/components/Cta';
import {
  alignItems,
  flexContent,
  px,
  textMedium,
  mb,
  mt,
  py,
  pl,
  textAlign,
  textMini,
  fontFamily,
  justifyContent,
  bgLight,
  roundedMd,
  flex,
  textBig,
} from '@/theme';
import { Message } from '@/services/messages/types';
import { htmlToPlainText } from '@/lib/html';
import { ScrollView } from 'react-native-gesture-handler';
import RenderHTML from '@/components/RenderHTML';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/hooks/useLanguage';
import { useTheme } from '@/hooks/useTheme';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import { useHomeTutorial } from '@/hooks/useHomeTutorial';

const SCROLL_END_THRESHOLD = 24;

type MessageItemProps = {
  item: Message;
  refreshing: boolean;
  onRefresh: () => void;
  canHintSwipe?: boolean;
  onEndReachedChange?: (reached: boolean) => void;
};

export default function MessageItem({
  item,
  refreshing,
  onRefresh,
  canHintSwipe = false,
  onEndReachedChange,
}: MessageItemProps) {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const theme = useTheme() ?? 'light';
  const { currentMessageId, isPlaying, isDownloading, play } = useAudioPlayer();
  const { requestShow } = useHomeTutorial();
  const isCurrent = currentMessageId === item.id;

  const layoutHeightRef = useRef(0);
  const contentHeightRef = useRef(0);
  const offsetYRef = useRef(0);
  const endReachedRef = useRef(false);

  const authorTitle = item.author?.title
    ? t(`home.titles.${item.author.title}`)
    : '';

  const authorLine = t('home.by_author', {
    name: `${item.author?.firstname} ${item.author?.lastname || ''}`.trim(),
    title: authorTitle,
  });

  // Reports whether the reader has reached the bottom of this message: it
  // drives both the one-shot swipe tutorial and the carousel nav buttons.
  // Content shorter than the viewport counts as "reached" — there is nothing
  // left to read either way.
  const checkScrollEnd = useCallback(() => {
    const layoutHeight = layoutHeightRef.current;
    const contentHeight = contentHeightRef.current;
    if (!layoutHeight || !contentHeight) return;

    const reached =
      offsetYRef.current + layoutHeight >= contentHeight - SCROLL_END_THRESHOLD;

    if (reached !== endReachedRef.current) {
      endReachedRef.current = reached;
      onEndReachedChange?.(reached);
    }
    if (reached && canHintSwipe) requestShow();
  }, [canHintSwipe, requestShow, onEndReachedChange]);

  const handleLayout = useCallback(
    (event: LayoutChangeEvent) => {
      layoutHeightRef.current = event.nativeEvent.layout.height;
      checkScrollEnd();
    },
    [checkScrollEnd],
  );

  const handleContentSizeChange = useCallback(
    (_width: number, height: number) => {
      contentHeightRef.current = height;
      checkScrollEnd();
    },
    [checkScrollEnd],
  );

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const { layoutMeasurement, contentOffset, contentSize } =
        event.nativeEvent;
      layoutHeightRef.current = layoutMeasurement.height;
      contentHeightRef.current = contentSize.height;
      offsetYRef.current = contentOffset.y;
      checkScrollEnd();
    },
    [checkScrollEnd],
  );

  // item.title/verses/content already come back in the displayed language —
  // getDayMessages() refetches with the x-mdj-lang header on every switch.
  const handleShare = () => {
    const body = [
      item.title,
      ...(item.verses ?? []),
      htmlToPlainText(item.content),
      authorLine,
      t('home.share_footer', { url: WEBSITE_URL }),
    ]
      .filter(Boolean)
      .join('\n\n');

    Share.share(
      { message: body, title: item.title },
      { dialogTitle: item.title },
    ).catch(() => undefined);
  };

  const handleListen = () => {
    play(item.id, language, {
      title: item.title,
      artist: t('welcome.title_line2'),
      artwork: item.cover ? `${API_URL}/files/${item.cover}/view` : undefined,
    });
  };

  return (
    <View style={[flexContent(1), px(20)]}>
      <ScrollView
        style={[flexContent(1)]}
        showsVerticalScrollIndicator
        onLayout={handleLayout}
        onContentSizeChange={handleContentSizeChange}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <MText
          style={[textBig, textAlign.center, mt(20), fontFamily.sfRegular]}
        >
          {t('home.daily_message')}
        </MText>
        <MText
          style={[textMini, textAlign.center, mb(20), fontFamily.sfRegular]}
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
          style={[textBig, textAlign.center, fontFamily.cormorantBold]}
        >{`${item.title}\n`}</MText>

        {item.cover && (
          <Image
            source={{ uri: `${API_URL}/files/${item.cover}/view` }}
            style={styles.coverImage}
            resizeMode="cover"
          />
        )}

        {item.verses && item.verses.length > 0 && (
          <View style={styles.versesContainer}>
            {item.verses.map((verse, index) => (
              <View
                key={index}
                style={[
                  styles.verseBlock,
                  bgLight(theme),
                  roundedMd,
                  py(12),
                  pl(14),
                ]}
              >
                <MText
                  style={[textMedium, fontFamily.cormorant, styles.verseText]}
                >
                  {verse}
                </MText>
              </View>
            ))}
          </View>
        )}

        <TouchableOpacity
          onPress={handleListen}
          disabled={isDownloading}
          style={[flex.row, justifyContent.center, styles.listenRow, mb(20)]}
        >
          <Icon
            name={isCurrent && isPlaying ? 'pause-circle' : 'play-circle'}
            color="primary"
            size={22}
          />
          <MText style={[textMini, fontFamily.sfBold, styles.listenLabel]}>
            {t('audio.listen')}
          </MText>
        </TouchableOpacity>

        <RenderHTML html={item.content} />

        <View style={[mt(40), justifyContent.center]}>
          <MText style={[textMedium, fontFamily.sfBold]}>{authorLine}</MText>
        </View>

        <View style={[mt(20), mb(160), alignItems.center]}>
          <CTA
            onPress={handleShare}
            disabled={false}
            color="foreground"
            accessibilityLabel={t('home.share_message')}
          >
            <Icon name="share-social-outline" color="foreground" size={22} />
          </CTA>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  versesContainer: {
    gap: 10,
    marginBottom: 16,
  },
  verseBlock: {
    borderLeftWidth: 3,
    borderLeftColor: '#a0845c',
  },
  verseText: {
    fontStyle: 'italic',
  },
  listenRow: {
    alignItems: 'center',
    gap: 6,
  },
  listenLabel: {
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  coverImage: {
    width: '100%',
    height: 200,
    marginBottom: 20,
    borderRadius: 8,
    overflow: 'hidden',
  },
});
