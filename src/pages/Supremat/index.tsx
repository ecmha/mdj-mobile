import { View } from 'react-native';
import DefaultLayout from '@/layouts/DefaultLayout';
import MText from '@/components/Text';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/hooks/useTheme';
import {
  fontFamily,
  textAlign,
  textMedium,
  textLargeX1,
  textSmall,
  mb,
  my,
  py,
  px,
  textPrimary,
  textSecondary,
  bgLight,
  roundedMd,
} from '@/theme';

export default function Supremat() {
  const { t } = useTranslation();
  const theme = useTheme() ?? 'light';

  return (
    <DefaultLayout pageTitle={t('supremat.title')}>
      <MText
        style={[
          fontFamily.cormorantBold,
          textLargeX1,
          textPrimary(theme),
          my(20),
          textAlign.center,
          { lineHeight: 28 },
        ]}
      >
        {t('supremat.tagline')}
      </MText>

      <MText
        style={[
          fontFamily.sfRegular,
          textMedium,
          mb(16),
          textAlign.justify,
          { lineHeight: 24 },
        ]}
      >
        {t('supremat.p1')}
      </MText>

      <MText
        style={[
          fontFamily.sfRegular,
          textMedium,
          mb(16),
          textAlign.justify,
          { lineHeight: 24 },
        ]}
      >
        {t('supremat.p2')}
      </MText>

      <MText
        style={[
          fontFamily.sfRegular,
          textMedium,
          mb(28),
          textAlign.justify,
          { lineHeight: 24 },
        ]}
      >
        {t('supremat.p3')}
      </MText>

      <View style={[bgLight(theme), roundedMd, py(16), px(20), mb(8)]}>
        <MText
          style={[
            fontFamily.cormorant,
            textLargeX1,
            textAlign.center,
            mb(8),
            { lineHeight: 30 },
          ]}
        >
          {t('supremat.verse')}
        </MText>
        <MText
          style={[
            fontFamily.cormorantBold,
            textSmall,
            textAlign.center,
            textSecondary(theme),
          ]}
        >
          {t('supremat.verse_ref')}
        </MText>
      </View>
    </DefaultLayout>
  );
}
