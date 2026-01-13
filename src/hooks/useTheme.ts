import { useColorScheme } from "react-native";

export const useTheme = () => {
    const scheme = useColorScheme();
    return scheme === "dark" ? "dark" : "light";
};
