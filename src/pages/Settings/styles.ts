import { DIMENSIONS } from "@/theme";
import { StyleSheet } from "react-native";

export default StyleSheet.create({
    container: {
    },
    blocHeader: {

    },
    blocContent: {
        width: '100%',
        minHeight: DIMENSIONS.SCREEN_HEIGHT / 18,
        borderRadius: 10,
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        height: DIMENSIONS.SCREEN_HEIGHT / 18,
        marginBottom: 1
    },
});