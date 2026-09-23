import { Image, TouchableOpacity, View } from 'react-native';
import { API_URL } from '@env';
import { useTranslation } from 'react-i18next';
import MText from '@/components/Text';
import { useTheme } from '@/hooks/useTheme';
import {
  bgLight,
  flexContent,
  fontFamily,
  mt,
  p,
  roundedMd,
  textMini,
  textSmall,
  textSecondary,
} from '@/theme';
import { BookmarkSummary } from '@/services/bookmarks/types';
import styles from './styles';

export type BookmarkCardVariant = 'list' | 'grid';

export type BookmarkCardProps = {
  bookmark: BookmarkSummary;
  variant: BookmarkCardVariant;
  onPress: (bookmark: BookmarkSummary) => void;
};

// The app logo stands in wherever a message has no cover of its own.
const DEFAULT_COVER = require('@/assets/imgs/default_message.png');

export default function BookmarkCard({
  bookmark,
  variant,
  onPress,
}: BookmarkCardProps) {
  const { t } = useTranslation();
  const theme = useTheme() ?? 'light';
  const isGrid = variant === 'grid';
  const { message } = bookmark;

  const cover = message?.cover
    ? { uri: `${API_URL}/files/${message.cover}/view` }
    : DEFAULT_COVER;

  // The server returns a null message when it was deleted after being saved.
  // The row stays, so the reader can still open it and remove it.
  const title = message ? message.title : t('bookmarks.unavailable_message');

  const author = message?.author;
  const authorLine = author
    ? t('bookmarks.by_author', {
        name: `${author.firstname} ${author.lastname ?? ''}`.trim(),
      })
    : null;

  return (
    <TouchableOpacity
      style={[
        isGrid ? styles.gridCard : styles.listCard,
        bgLight(theme),
        roundedMd,
        p(10),
      ]}
      onPress={() => onPress(bookmark)}
      accessibilityRole="button"
      accessibilityLabel={title}
    >
      <Image
        source={cover}
        style={isGrid ? styles.gridCover : styles.listCover}
        resizeMode="cover"
      />
      <View
        style={[isGrid ? styles.gridText : styles.listText, flexContent(1)]}
      >
        <MText style={[textSmall, fontFamily.cormorantBold]} numberOfLines={2}>
          {title}
        </MText>
        {authorLine && (
          <MText
            style={[textMini, fontFamily.sfItalic, textSecondary(theme), mt(4)]}
            numberOfLines={1}
          >
            {authorLine}
          </MText>
        )}
      </View>
    </TouchableOpacity>
  );
}
