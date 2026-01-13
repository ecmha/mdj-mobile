import Icon from '../Icon';
import styles from './styles';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function Header({ title }: { title: string }) {
  const navigation = useNavigation();
  return (
    <View style={styles.header}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Icon name="arrow-back" color="default" size={25} />
      </TouchableOpacity>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}
