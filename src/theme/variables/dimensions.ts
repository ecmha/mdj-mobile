import { Dimensions, StatusBar } from "react-native";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("screen");
const { width: WINDOW_WIDTH, height: WINDOW_HEIGHT } = Dimensions.get("window");

export const scale =
  SCREEN_WIDTH > SCREEN_HEIGHT
    ? SCREEN_HEIGHT / SCREEN_WIDTH
    : SCREEN_WIDTH / SCREEN_HEIGHT;

export const STATUS_BAR_HEIGHT = StatusBar.currentHeight ?? 0;

export const BOTTOM_NAVIGATION_HEIGHT =
  SCREEN_HEIGHT - WINDOW_HEIGHT - STATUS_BAR_HEIGHT;

export const DIMENSIONS = {
    SCREEN_WIDTH,
    SCREEN_HEIGHT,
    WINDOW_WIDTH,
    WINDOW_HEIGHT,
}