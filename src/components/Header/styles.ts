import { StyleSheet } from "react-native";
import {DIMENSIONS, STATUS_BAR_HEIGHT} from "@/theme";

export default StyleSheet.create({
    header: {
        height: DIMENSIONS.SCREEN_HEIGHT / 18,
        width: DIMENSIONS.SCREEN_WIDTH,
        alignItems: 'center',
        flexDirection: 'row',
        marginTop: STATUS_BAR_HEIGHT,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        flex: 1,
    },
    backButton: {
        width: 50,
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    }
});