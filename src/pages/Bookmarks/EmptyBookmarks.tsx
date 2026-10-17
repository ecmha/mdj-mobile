import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import MText from '@/components/Text';
import { useTheme } from '@/hooks/useTheme';
import {
  alignItems,
  flexContent,
  fontFamily,
  justifyContent,
  mt,
  px,
  textAlign,
  textLargeX4,
  textMedium,
  textMini,
  textPrimary,
  textSecondary,
} from '@/theme';

// Same visual idiom as Home's EmptyList, without the ScrollView: this one is
// a FlatList's ListEmptyComponent, and the list already owns the scrolling.
export default function EmptyBookmarks({ failed }: { failed?: boolean }) {
  const { t } = useTranslation();
  const theme = useTheme() ?? 'light';

  return (
    <View
      style={[
        flexContent(1),
        justifyContent.center,
        alignItems.center,
        px(32),
        mt(80),
      ]}
    >
      <MText style={[textLargeX4, textPrimary(theme), textAlign.center]}>
        {'✝'}
      </MText>
      <MText
        style={[
          textMedium,
          textAlign.center,
          fontFamily.cormorantBold,
          textPrimary(theme),
          mt(16),
        ]}
      >
        {t(failed ? 'bookmarks.error' : 'bookmarks.empty')}
      </MText>
      <MText
        style={[
          textMini,
          textAlign.center,
          fontFamily.sfBold,
          textSecondary(theme),
          mt(8),
        ]}
      >
        {t(failed ? 'bookmarks.error_hint' : 'bookmarks.empty_hint')}
      </MText>
    </View>
  );
}
