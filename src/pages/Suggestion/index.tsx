import DefaultLayout from '@/layouts/DefaultLayout';
// import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import {
  alignItems,
  bgLight,
  flexContent,
  hValue,
  justifyContent,
  my,
  mt,
  p,
  roundedLg,
  bgPrimary,
  textColor,
} from '@/theme';
import { TextInput, TouchableOpacity, View } from 'react-native';
import MText from '@/components/Text';
import { useTheme } from '@/hooks/useTheme';
import { useTranslation } from 'react-i18next';

import styles from './styles';

export default function Suggestion() {
  const theme = useTheme();
  const { t } = useTranslation();
  return (
    <DefaultLayout pageTitle={t('suggestion.title')}>
      <View style={[flexContent(3), p(10), mt(40)]}>
        <MText style={[mt(15)]}>{t('suggestion.name_label')}</MText>
        <TextInput
          style={[styles.input, bgLight(theme), roundedLg, my(11)]}
          placeholder={t('suggestion.name_placeholder')}
        />
        <MText style={[mt(15)]}>{t('suggestion.message_label')}</MText>
        <TextInput
          style={[styles.textArea, bgLight(theme), roundedLg, my(11)]}
          placeholder={t('suggestion.message_placeholder')}
          multiline
          numberOfLines={10}
          textAlignVertical="top"
        />
      </View>
      <View style={[flexContent(1), p(10)]}>
        <TouchableOpacity
          activeOpacity={0.7}
          style={[styles.button, bgPrimary(theme), roundedLg]}
        >
          <MText style={[textColor('white')]}>{t('suggestion.send')}</MText>
        </TouchableOpacity>
      </View>
    </DefaultLayout>
  );
}
