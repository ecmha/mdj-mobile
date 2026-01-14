import { ThemeContext } from "@/contexts/themeProvider";
import { useContext } from "react";

export const useTheme = () => {
    const {theme} = useContext(ThemeContext);
        
    return theme;
};
