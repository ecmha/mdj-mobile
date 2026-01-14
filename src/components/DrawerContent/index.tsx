import { View } from 'react-native';
import MText from '@/components/Text';

type DrawerContentProps = {
  onPressRoute: (route: never) => void;
};

export default function DrawerContent({ onPressRoute }: DrawerContentProps) {
  return (
    <View>
      <MText>DrawerContent</MText>
    </View>
  );
}
