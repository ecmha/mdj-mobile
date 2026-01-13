import { Text, View } from "react-native";

type DrawerContentProps = {
  onPressRoute: (route: never) => void;
};

export default function DrawerContent({ onPressRoute }: DrawerContentProps) {
    return (
        <View>
            <Text>DrawerContent</Text>
        </View>
    );
}   