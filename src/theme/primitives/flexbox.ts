import { StyleSheet } from "react-native";

export const flex = StyleSheet.create({
  row: {
    flexDirection: "row",
  },
  rowReverse: {
    flexDirection: "row-reverse",
  },
  column: {
    flexDirection: "column",
  },
  columnReverse: {
    flexDirection: "column-reverse",
  },
  wrap: {
    flexWrap: "wrap",
  },
  nowrap: {
    flexWrap: "nowrap",
  },
  wrapReverse: {
    flexWrap: "wrap-reverse",
  },
});

export const flexContent = (ratio: number) => ({
  flex: ratio,
});

export const justifyContent = StyleSheet.create({
  center: {
    justifyContent: "center",
  },
  start: {
    justifyContent: "flex-start",
  },
  end: {
    justifyContent: "flex-end",
  },
  spaceBetween: {
    justifyContent: "space-between",
  },
  spaceAround: {
    justifyContent: "space-around",
  },
  spaceEvenly: {
    justifyContent: "space-evenly",
  },
});

export const alignItems = StyleSheet.create({
  center: {
    alignItems: "center",
  },
  start: {
    alignItems: "flex-start",
  },
  end: {
    alignItems: "flex-end",
  },
});

export const alignSelf = StyleSheet.create({
  center: {
    alignSelf: "center",
  },
  start: {
    alignSelf: "flex-start",
  },
  end: {
    alignSelf: "flex-end",
  },
});

export const alignContent = StyleSheet.create({
  center: {
    alignContent: "center",
  },
  start: {
    alignContent: "flex-start",
  },
  end: {
    alignContent: "flex-end",
  },
  spaceBetween: {
    alignContent: "space-between",
  },
  spaceAround: {
    alignContent: "space-around",
  },
  spaceEvenly: {
    alignContent: "space-evenly",
  },
});
