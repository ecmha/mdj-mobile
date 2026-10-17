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

// Same visual idiom as EmptyBookmarks: the list's ListEmptyComponent.
export default function EmptyTopics({ failed }: { failed?: boolean }) {
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
        {t(failed ? 'topics.error' : 'topics.empty')}
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
        {t(failed ? 'topics.error_hint' : 'topics.empty_hint')}
      </MText>
    </View>
  );
}
