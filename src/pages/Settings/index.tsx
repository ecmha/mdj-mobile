import DefaultLayout from '@/layouts/DefaultLayout';
import { TouchableOpacity, View, ScrollView } from 'react-native';
import MText from '@/components/Text';
import styles from './styles';
import Icon from '@/components/Icon';
import {
  flex,
  alignItems,
  px,
  bgLight,
  overflow,
  textBig,
  my,
  hValue,
} from '@/theme';
import { useTheme } from '@/hooks/useTheme';
import LinksGroup from '@/components/LinksGroup';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '@/Navigation';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export default function Settings() {
  const theme = useTheme() ?? 'light';
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  return (
    <DefaultLayout pageTitle="Paramètres">
      <ScrollView contentContainerStyle={[styles.container, px(10)]}>
        <LinksGroup
          header="Personnaliser"
          links={[
            {
              id: 'language',
              icon: 'language-outline',
              label: 'Langue',
              onPress: () => {
                navigation.navigate('LanguageSetting');
              },
            },
            {
              id: 'theme',
              icon: theme === 'light' ? 'moon-outline' : 'sunny-outline',
              label: 'Thème',
              onPress: () => {
                navigation.navigate('ThemeSetting');
              },
            },
          ]}
        />
        <LinksGroup
          header="Soutenir l'action"
          links={[
            {
              id: 'share',
              icon: 'share-social-outline',
              label: "Partager l'app",
              onPress: () => {
                //TODO: open playstore
              },
            },
            {
              id: 'rate',
              icon: 'star-outline',
              label: 'Laisser un avis',
              onPress: () => {
                //TODO: open playstore
              },
            },
            {
              id: 'suggestion',
              icon: 'chatbubble-ellipses-outline',
              label: 'Faire une suggestion',
              onPress: () => {
                navigation.navigate('Suggestion');
              },
            },
            {
              id: 'donate',
              icon: 'gift-outline',
              label: 'Faire un don',
              onPress: () => {
                //TODO: open playstore
              },
            },
          ]}
        />
        <LinksGroup
          header="Nous suivre"
          links={[
            {
              id: 'twitter',
              icon: 'logo-twitter',
              label: 'Twitter',
              onPress: () => {},
            },
            {
              id: 'facebook',
              icon: 'logo-facebook',
              label: 'Facebook',
              onPress: () => {},
            },
          ]}
        />
        <LinksGroup
          header="Autres"
          links={[
            {
              id: 'privacy',
              icon: 'lock-closed-outline',
              label: 'Politique de confidentialité',
              onPress: () => {},
            },
            {
              id: 'terms',
              icon: 'document-text-outline',
              label: "Conditions d'utilisation",
              onPress: () => {},
            },
          ]}
        />
        <View style={[my(20), alignItems.center]}>
          <MText style={[textBig]}>MDJ - Version 1.0.0</MText>
        </View>
      </ScrollView>
    </DefaultLayout>
  );
}
