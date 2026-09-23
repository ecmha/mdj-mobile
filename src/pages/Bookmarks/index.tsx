import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import DefaultLayout from '@/layouts/DefaultLayout';
import Icon from '@/components/Icon';
import MText from '@/components/Text';
import BookmarkCard from '@/components/BookmarkCard';
import { useNavigation } from '@/hooks/useNavigation';
import { useTheme } from '@/hooks/useTheme';
import { colors } from '@/theme/variables/colors';
import { fontFamily, my, textMini, textSecondary } from '@/theme';
import { retrieveItem, saveItem, STORAGE_KEYS } from '@/lib/storage';
import { BookmarkSummary } from '@/services/bookmarks/types';
import { useBookmarkList } from './useBookmarkList';
import EmptyBookmarks from './EmptyBookmarks';

type ViewMode = 'list' | 'grid';

export default function Bookmarks() {
  const { t } = useTranslation();
  const theme = useTheme() ?? 'light';
  const navigation = useNavigation();
  const [mode, setMode] = useState<ViewMode>('list');
  const {
    items,
    total,
    loading,
    loadingMore,
    refreshing,
    failed,
    reload,
    refresh,
    loadMore,
  } = useBookmarkList();

  // Remembered like the theme and the language, so the reader's choice
  // survives leaving the screen.
  useEffect(() => {
    retrieveItem(STORAGE_KEYS.BOOKMARKS_VIEW)
      .then(stored => {
        if (stored === 'grid' || stored === 'list') setMode(stored);
      })
      .catch(() => {});
  }, []);

  const toggleMode = useCallback(() => {
    setMode(current => {
      const next: ViewMode = current === 'list' ? 'grid' : 'list';
      saveItem(STORAGE_KEYS.BOOKMARKS_VIEW, next);
      return next;
    });
  }, []);

  // Refetched on focus: coming back from a removal must not leave the row
  // behind. The first focus is the initial load, later ones are silent.
  useFocusEffect(
    useCallback(() => {
      reload();
    }, [reload]),
  );

  const openBookmark = useCallback(
    (bookmark: BookmarkSummary) =>
      navigation.navigate('BookmarkMessage', {
        bookmarkId: bookmark.id,
        title: bookmark.message?.title,
      }),
    [navigation],
  );

  const renderItem = useCallback(
    ({ item }: { item: BookmarkSummary }) => (
      <BookmarkCard bookmark={item} variant={mode} onPress={openBookmark} />
    ),
    [mode, openBookmark],
  );

  const isGrid = mode === 'grid';

  return (
    <DefaultLayout pageTitle={t('bookmarks.title')} scrollable={false}>
      <View style={styles.toolbar}>
        <MText style={[textMini, fontFamily.sfBold, textSecondary(theme)]}>
          {t('bookmarks.count', { count: total })}
        </MText>
        <TouchableOpacity
          onPress={toggleMode}
          accessibilityRole="button"
          accessibilityLabel={t(
            isGrid ? 'bookmarks.view_list' : 'bookmarks.view_grid',
          )}
        >
          <Icon
            name={isGrid ? 'list-outline' : 'grid-outline'}
            color="foreground"
            size={22}
          />
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator
          style={styles.loader}
          size="large"
          color={colors[theme].primary}
        />
      ) : (
        <FlatList
          // React Native needs a fresh list when the column count changes.
          key={mode}
          data={items}
          renderItem={renderItem}
          keyExtractor={bookmark => bookmark.id}
          numColumns={isGrid ? 2 : 1}
          columnWrapperStyle={isGrid ? styles.column : undefined}
          contentContainerStyle={[styles.content, my(4)]}
          showsVerticalScrollIndicator={false}
          onEndReached={loadMore}
          onEndReachedThreshold={0.4}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={refresh} />
          }
          ListEmptyComponent={<EmptyBookmarks failed={failed} />}
          ListFooterComponent={
            loadingMore ? (
              <ActivityIndicator
                style={styles.footer}
                color={colors[theme].primary}
              />
            ) : null
          }
        />
      )}
    </DefaultLayout>
  );
}

const styles = StyleSheet.create({
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  content: {
    flexGrow: 1,
    // Rows only: the gutter between the two columns is the space `column`
    // leaves, so a column gap here would be added on top of it.
    rowGap: 12,
    paddingBottom: 40,
  },
  column: {
    // Keeps the two cards at the outer edges, and leaves a lone card on the
    // last row at its own width instead of centring or stretching it.
    justifyContent: 'space-between',
  },
  footer: {
    paddingVertical: 20,
  },
  loader: {
    marginTop: 60,
  },
});
