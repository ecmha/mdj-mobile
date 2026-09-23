import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, StatusBar, StyleSheet, View } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import CTA from '@/components/Cta';
import Icon from '@/components/Icon';
import MText from '@/components/Text';
import Toast from '@/components/Toast';
import MessageItem from '@/components/MessageItem';
import { useNavigation } from '@/hooks/useNavigation';
import { useTheme } from '@/hooks/useTheme';
import { useBookmarks } from '@/hooks/useBookmarks';
import { colors } from '@/theme/variables/colors';
import {
  alignItems,
  bgDefault,
  flexContent,
  fontFamily,
  justifyContent,
  px,
  STATUS_BAR_HEIGHT,
  textAlign,
  textMedium,
} from '@/theme';
import { getBookmark, removeBookmark } from '@/services/bookmarks';
import { Bookmark } from '@/services/bookmarks/types';
import { RootStackParamList } from '@/Navigation';

// Laid out like Home rather than like a Settings page: the message fills the
// screen and the actions float over it.
export default function BookmarkMessage() {
  const { t } = useTranslation();
  const theme = useTheme() ?? 'light';
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { setStatus } = useBookmarks();
  const { params } = useRoute<RouteProp<RootStackParamList, 'BookmarkMessage'>>();

  const [bookmark, setBookmark] = useState<Bookmark | null>(null);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    getBookmark(params.bookmarkId)
      .then(result => {
        if (active) setBookmark(result);
      })
      .catch(() => {})
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [params.bookmarkId]);

  const handleRemove = useCallback(() => {
    if (removing) return;
    setRemoving(true);
    removeBookmark(params.bookmarkId)
      .then(() => {
        // Empties Home's icon for this message; the list refetches on focus.
        if (bookmark?.message) setStatus(bookmark.message.id, null);
        navigation.goBack();
      })
      .catch(() => {
        setRemoving(false);
        setToastMessage(t('bookmarks.remove_error'));
      });
  }, [removing, params.bookmarkId, bookmark, setStatus, navigation, t]);

  return (
    <View
      style={[
        styles.container,
        bgDefault(theme),
        { paddingBottom: insets.bottom },
      ]}
    >
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle={theme === 'dark' ? 'light-content' : 'dark-content'}
      />

      <View style={[flexContent(1)]}>
        {loading ? (
          <ActivityIndicator
            style={styles.loader}
            size="large"
            color={colors[theme].primary}
          />
        ) : bookmark?.message ? (
          <MessageItem item={bookmark.message} />
        ) : (
          // Either the bookmark could not be loaded, or its message was
          // deleted after it was saved. Removing it is still the useful
          // action, and the CTA above stays available for exactly that.
          <View
            style={[
              flexContent(1),
              justifyContent.center,
              alignItems.center,
              px(32),
            ]}
          >
            <MText
              style={[textMedium, textAlign.center, fontFamily.cormorant]}
            >
              {t('bookmarks.unavailable_message')}
            </MText>
          </View>
        )}
      </View>

      <View style={styles.ctaLeft}>
        <CTA
          onPress={() => navigation.goBack()}
          disabled={false}
          color="foreground"
          accessibilityLabel={t('bookmarks.back')}
        >
          <Icon name="arrow-back" color="foreground" size={25} />
        </CTA>
      </View>
      <View style={styles.ctaRight}>
        <CTA
          onPress={handleRemove}
          disabled={removing}
          color="foreground"
          accessibilityLabel={t('home.bookmark.remove')}
        >
          {removing ? (
            <ActivityIndicator size="small" color={colors[theme].primary} />
          ) : (
            <Icon name="bookmark" color="foreground" size={25} />
          )}
        </CTA>
      </View>

      <Toast
        message={toastMessage}
        onHide={() => setToastMessage(null)}
        style={styles.toast}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: STATUS_BAR_HEIGHT,
  },
  ctaRight: {
    position: 'absolute',
    top: STATUS_BAR_HEIGHT,
    right: 20,
  },
  ctaLeft: {
    position: 'absolute',
    top: STATUS_BAR_HEIGHT,
    left: 20,
  },
  loader: {
    marginTop: 60,
  },
  toast: {
    bottom: 40,
  },
});
