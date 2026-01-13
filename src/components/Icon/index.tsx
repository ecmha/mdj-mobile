import { Ionicons } from "@react-native-vector-icons/ionicons";
import { ComponentProps } from "react";

export type IconNameType = ComponentProps<typeof Ionicons>["name"];

export type IconPropsType = ComponentProps<typeof Ionicons> & {
  color: ColorType;
};

export default Ionicons;