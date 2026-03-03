import { RefreshControl } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import MText from '@/components/Text';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/hooks/useTheme';
import {
  flexContent,
  textAlign,
  fontFamily,
  textLargeX4,
  textMedium,
  textMini,
  textPrimary,
  textSecondary,
  justifyContent,
  alignItems,
  mt,
  px,
} from '@/theme';

interface EmptyListProps {
  refreshing: boolean;
  onRefresh: () => void;
}

export default function EmptyList({ refreshing, onRefresh }: EmptyListProps) {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <ScrollView
      contentContainerStyle={[
        flexContent(1),
        justifyContent.center,
        alignItems.center,
        px(32),
      ]}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <MText
        style={[textLargeX4, textPrimary(theme), textAlign.center]}
      >
        {'✝'}
      </MText>
      <MText
        style={[
          textMedium,
          textAlign.center,
          fontFamily.cormorant,
          textPrimary(theme),
          mt(16),
        ]}
      >
        {t('home.empty')}
      </MText>
      <MText
        style={[
          textMini,
          textAlign.center,
          fontFamily.sfItalic,
          textSecondary(theme),
          mt(8),
        ]}
      >
        {t('home.empty_hint')}
      </MText>
    </ScrollView>
  );
}
