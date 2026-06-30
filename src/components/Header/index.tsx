import Icon from '../Icon';
import styles from './styles';
import { View, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@/hooks/useNavigation';
import MText from '@/components/Text';

export default function Header({ title }: { title: string }) {
  const navigation = useNavigation();
  return (
    <View style={styles.header}>
      <View style={styles.pageInfo}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" color="default" size={25} />
        </TouchableOpacity>
        <MText style={styles.title}>{title}</MText>
      </View>
      <TouchableOpacity
        style={styles.backToHome}
        onPress={() =>
          navigation.reset({ index: 0, routes: [{ name: 'Home' }] })
        }
      >
        <Image
          source={require('@/assets/imgs/app_icon.png')}
          style={styles.appIcon}
        />
      </TouchableOpacity>
    </View>
  );
}
