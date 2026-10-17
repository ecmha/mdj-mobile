import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import BottomSheet from '@/components/BottomSheet';
import Button from '@/components/Button';
import MText from '@/components/Text';
import {
  alignItems,
  fontFamily,
  mt,
  px,
  textAlign,
  textLargeX1,
  textMedium,
} from '@/theme';

type LogoutConfirmModalProps = {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

// Signing out is one tap from undoable only if the reader remembers their
// password, so it is confirmed. Same sheet as the sign-in prompt, to keep the
// two account moments looking alike.
export default function LogoutConfirmModal({
  visible,
  onCancel,
  onConfirm,
}: LogoutConfirmModalProps) {
  const { t } = useTranslation();

  return (
    <BottomSheet
      visible={visible}
      onDismiss={onCancel}
      dismissLabel={t('my_informations.logout_confirm.close')}
    >
      {/* Three children, and the sheet spaces them apart: the title sits at
          the top, the question in the middle, the buttons at the bottom. */}
      <View style={[alignItems.center, mt(8)]}>
        <MText
          accessibilityRole="header"
          style={[fontFamily.cormorantBold, textLargeX1, textAlign.center]}
        >
          {t('my_informations.logout_confirm.title')}
        </MText>
      </View>

      {/* No colour of its own: MText's default foreground is the near-black
          the rest of the page uses, and it stays legible in the dark theme. */}
      <MText style={[textMedium, fontFamily.sfBold, textAlign.center, px(8)]}>
        {t('my_informations.logout_confirm.description')}
      </MText>

      <View>
        <Button
          label={t('my_informations.logout_confirm.confirm')}
          onPress={onConfirm}
        />
        <Button
          label={t('my_informations.logout_confirm.cancel')}
          variant="outline"
          onPress={onCancel}
          style={mt(12)}
        />
      </View>
    </BottomSheet>
  );
}
