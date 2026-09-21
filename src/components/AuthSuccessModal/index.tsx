import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import MText from '@/components/Text';
import Button from '@/components/Button';
import BottomSheet from '@/components/BottomSheet';
import { fontFamily, mt, textAlign, textLargeX1, textSmall } from '@/theme';

type AuthSuccessModalProps = {
  visible: boolean;
  firstname?: string;
  onContinue: () => void;
};

// Shown after a successful login or signup. No backdrop dismissal: `Continue`
// is what closes it and lets the caller navigate away.
export default function AuthSuccessModal({
  visible,
  firstname,
  onContinue,
}: AuthSuccessModalProps) {
  const { t } = useTranslation();

  return (
    <BottomSheet visible={visible}>
      <View style={styles.header}>
        {/* Decorative: the title already says what happened. */}
        <MText
          style={styles.emoji}
          accessible={false}
          importantForAccessibility="no-hide-descendants"
        >
          🎉
        </MText>
        <MText
          accessibilityRole="header"
          style={[
            fontFamily.cormorantBold,
            textLargeX1,
            textAlign.center,
            mt(8),
          ]}
        >
          {firstname
            ? t('auth.success.title', { firstname })
            : t('auth.success.title_no_name')}
        </MText>
        <MText
          style={[fontFamily.sfRegular, textSmall, textAlign.center, mt(12)]}
        >
          {t('auth.success.description')}
        </MText>
      </View>
      <Button label={t('auth.success.continue')} onPress={onContinue} />
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  header: {
    flex: 1,
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 56,
    lineHeight: 64,
    textAlign: 'center',
  },
});
