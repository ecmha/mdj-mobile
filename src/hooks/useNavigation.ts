import { useNavigation as useReactNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../Navigation";

export function useNavigation() {
    return useReactNavigation<NativeStackNavigationProp<RootStackParamList>>();
}