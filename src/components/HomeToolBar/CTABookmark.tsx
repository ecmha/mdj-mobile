import { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Message } from '@/services/messages/types';
import { useAuth } from '@/hooks/useAuth';
import { useBookmarks } from '@/hooks/useBookmarks';
import { useNavigation } from '@/hooks/useNavigation';
import HomeTool from './Tool';

export type CTABookmarkProps = {
  message?: Message | null;
  onToast: (message: string) => void;
};

export default function CTABookmark({ message, onToast }: CTABookmarkProps) {
  const { t } = useTranslation();
  const { requireAuth } = useAuth();
  const navigation = useNavigation();
  const { isBookmarked, isSaving, save, ensureStatus } = useBookmarks();

  const messageId = message?.id;
  const saved = messageId ? isBookmarked(messageId) : false;
  const saving = messageId ? isSaving(messageId) : false;

  // Fills the icon for a message the reader already saved. Cached and
  // guest-aware, so swiping back and forth costs nothing.
  useEffect(() => {
    if (messageId) ensureStatus(messageId);
  }, [messageId, ensureStatus]);

  const handlePress = useCallback(() => {
    if (!messageId || saving) return;

    if (saved) {
      // A saved message is not unsaved from here: the filled icon opens the
      // bookmarks list, which is where removing one lives.
      navigation.navigate('Bookmarks');
      return;
    }

    requireAuth(() => {
      // `save` handles its own failures and never rejects.
      save(messageId).then(result => {
        // 'signed-out' says the sign-in prompt is already showing, so a toast
        // on top of it would only be noise.
        if (result === 'saved') onToast(t('home.bookmark.added'));
        else if (result === 'failed') onToast(t('home.bookmark.error'));
      });
    });
  }, [messageId, saving, saved, requireAuth, navigation, save, onToast, t]);

  return (
    <HomeTool
      onPress={handlePress}
      accessibilityLabel={t(
        saved ? 'home.bookmark.open_list' : 'home.bookmark.add',
      )}
      icon={saved ? 'bookmark' : 'bookmark-outline'}
    />
  );
}
