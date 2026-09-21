import { useState } from 'react';
import {
  StyleSheet,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import Icon from '@/components/Icon';
import MText from '@/components/Text';
import { useTheme } from '@/hooks/useTheme';
import {
  bgLight,
  fontFamily,
  mt,
  roundedLg,
  textColorDefault,
  textDanger,
  textMini,
  textSmall,
} from '@/theme';

type FormInputProps = TextInputProps & {
  label: string;
  error?: string | null;
};

// Labelled text field with an optional error line underneath. A
// `secureTextEntry` field gets an eye button to reveal what was typed.
export default function FormInput({
  label,
  error,
  style,
  secureTextEntry,
  ...inputProps
}: FormInputProps) {
  const theme = useTheme() ?? 'light';
  const { t } = useTranslation();
  const [revealed, setRevealed] = useState(false);
  return (
    <View style={mt(15)}>
      <MText style={[fontFamily.sfRegular, textSmall]}>{label}</MText>
      <View style={mt(8)}>
        <TextInput
          accessibilityLabel={label}
          secureTextEntry={secureTextEntry && !revealed}
          style={[
            styles.input,
            bgLight(theme),
            textColorDefault(theme),
            roundedLg,
            secureTextEntry && styles.inputWithToggle,
            style,
          ]}
          {...inputProps}
        />
        {secureTextEntry ? (
          <TouchableOpacity
            style={styles.toggle}
            onPress={() => setRevealed(current => !current)}
            accessibilityRole="button"
            accessibilityLabel={
              revealed
                ? t('auth.fields.hide_password')
                : t('auth.fields.show_password')
            }
          >
            <Icon
              name={revealed ? 'eye-off-outline' : 'eye-outline'}
              color="foreground"
              size={22}
            />
          </TouchableOpacity>
        ) : null}
      </View>
      {error ? (
        <MText style={[textDanger(theme), textMini, mt(4)]}>{error}</MText>
      ) : null}
    </View>
  );
}

const TOGGLE_WIDTH = 48;

const styles = StyleSheet.create({
  input: {
    height: 48,
    paddingHorizontal: 14,
  },
  // Keeps the text clear of the eye button.
  inputWithToggle: {
    paddingRight: TOGGLE_WIDTH,
  },
  toggle: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: TOGGLE_WIDTH,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
