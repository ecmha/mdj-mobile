import {DIMENSIONS, scale} from "@/theme/variables/dimensions";
import { DimensionValue } from "react-native";

export const w100: { width: DimensionValue } = {
  width: "100%",
};

export const h100: { height: DimensionValue } = {
  height: "100%",
};

export const wScreen = {
  width: DIMENSIONS.SCREEN_WIDTH,
};

export const hScreen = {
  height: DIMENSIONS.SCREEN_HEIGHT,
};

export const wValue = (value: number) => ({
  width: value / scale,
});

export const hValue = (value: number) => ({
  height: value / scale,
});

export const wPercentage = (percentage: number): { width: DimensionValue } => ({
  width: `${percentage}%`,
});

export const hPercentage = (
  percentage: number
): { height: DimensionValue } => ({
  height: `${percentage}%`,
});
