import { StyleSheet, TextInput, TextInputProps, View } from 'react-native';
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

// Labelled text field with an optional error line underneath.
export default function FormInput({
  label,
  error,
  style,
  ...inputProps
}: FormInputProps) {
  const theme = useTheme() ?? 'light';

  return (
    <View style={mt(15)}>
      <MText style={[fontFamily.sfRegular, textSmall]}>{label}</MText>
      <TextInput
        accessibilityLabel={label}
        style={[
          styles.input,
          bgLight(theme),
          textColorDefault(theme),
          roundedLg,
          mt(8),
          style,
        ]}
        {...inputProps}
      />
      {error ? (
        <MText style={[textDanger(theme), textMini, mt(4)]}>{error}</MText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    height: 48,
    paddingHorizontal: 14,
  },
});
