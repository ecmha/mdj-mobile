import DefaultLayout from '@/layouts/DefaultLayout';
// import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import {
  bgLight,
  flexContent,
  my,
  mt,
  p,
  roundedLg,
  bgPrimary,
  textColor,
  textDanger,
} from '@/theme';
import {
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import MText from '@/components/Text';
import { useTheme } from '@/hooks/useTheme';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { createFeedback } from '@/services/feedbacks';

import styles from './styles';

export default function Suggestion() {
  const theme = useTheme();
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState({ name: false, message: false });

  const handleSend = async () => {
    const nameEmpty = !name.trim();
    const messageEmpty = !message.trim();
    setSent(false);
    if (nameEmpty || messageEmpty) {
      setErrors({ name: nameEmpty, message: messageEmpty });
      return;
    }
    setErrors({ name: false, message: false });
    setLoading(true);
    try {
      await createFeedback({ name: name.trim(), message: message.trim() });
      setSent(true);
      setName('');
      setMessage('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DefaultLayout pageTitle={t('suggestion.title')}>
      <View style={[flexContent(3), p(10), mt(40)]}>
        <MText style={[mt(15)]}>{t('suggestion.name_label')}</MText>
        <TextInput
          style={[styles.input, bgLight(theme), roundedLg, my(11)]}
          placeholder={t('suggestion.name_placeholder')}
          value={name}
          onChangeText={setName}
          editable={!loading}
        />
        {errors.name && (
          <MText style={[textDanger(theme)]}>
            {t('suggestion.error_name')}
          </MText>
        )}
        <MText style={[mt(15)]}>{t('suggestion.message_label')}</MText>
        <TextInput
          style={[styles.textArea, bgLight(theme), roundedLg, my(11)]}
          placeholder={t('suggestion.message_placeholder')}
          multiline
          numberOfLines={10}
          textAlignVertical="top"
          value={message}
          onChangeText={setMessage}
          editable={!loading}
        />
        {errors.message && (
          <MText style={[textDanger(theme)]}>
            {t('suggestion.error_message')}
          </MText>
        )}
        {sent && <MText style={[mt(10)]}>{t('suggestion.sent')}</MText>}
      </View>
      <View style={[flexContent(1), p(10)]}>
        <TouchableOpacity
          activeOpacity={0.7}
          style={[styles.button, bgPrimary(theme), roundedLg]}
          onPress={handleSend}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <MText style={[textColor('white')]}>{t('suggestion.send')}</MText>
          )}
        </TouchableOpacity>
      </View>
    </DefaultLayout>
  );
}
