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

import styles from './styles';

export default function Suggestion() {
  const theme = useTheme();
  return (
    <DefaultLayout pageTitle="Faire une suggestion">
      <View style={[flexContent(3), p(10), mt(40)]}>
        <MText style={[mt(15)]}>Nom et prénom</MText>
        <TextInput
          style={[styles.input, bgLight(theme), roundedLg, my(11)]}
          placeholder="Votre nom ici"
        />
        <MText style={[mt(15)]}>Message</MText>
        <TextInput
          style={[styles.textArea, bgLight(theme), roundedLg, my(11)]}
          placeholder="Votre message ici ..."
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
          <MText style={[textColor('white')]}>Envoyer</MText>
        </TouchableOpacity>
      </View>
    </DefaultLayout>
  );
}
