import { StyleSheet } from "react-native";

export const aspect_ratio = StyleSheet.create({
  square: {
    aspectRatio: 1 / 1,
  },
  auto: {
    aspectRatio: "auto",
  },
  16_9: {
    aspectRatio: 16 / 9,
  },
});

export const position = StyleSheet.create({
  absolute: {
    position: "absolute",
  },
  relative: {
    position: "relative",
  },
  static: {
    position: "static",
  },
});

export const overflow = StyleSheet.create({
  hidden: {
    overflow: "hidden",
  },
  scroll: {
    overflow: "scroll",
  },
  visible: {
    overflow: "visible",
  },
});

export const top = (offset: number) => ({
  top: offset,
});

export const bottom = (offset: number) => ({
  bottom: offset,
});

export const left = (offset: number) => ({
  left: offset,
});

export const right = (offset: number) => ({
  right: offset,
});

export const z = (index: number) => ({
  zIndex: index,
});
