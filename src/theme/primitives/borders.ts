import { StyleSheet } from "react-native";
import {colors} from "../variables/colors";

/* ------ DIVIDER ----- */

export const divider = (theme: "light" | "dark") => ({
  borderBottomWidth: StyleSheet.hairlineWidth,
  borderBottomColor: colors[theme].default,
});

/* ------ BORDER STYLE ----- */

export const border = StyleSheet.create({
  dashed: {
    borderStyle: "dashed",
  },
  dotted: {
    borderStyle: "dotted",
  },
  solid: {
    borderStyle: "solid",
  },
});

/* ------ BORDER RADIUS ----- */

export const roundedXs = {
  borderRadius: 2,
};
export const roundedSm = {
  borderRadius: 4,
};
export const roundedMd = {
  borderRadius: 6,
};
export const roundedLg = {
  borderRadius: 8,
};
export const roundedXL = {
  borderRadius: 12,
};
export const roundedXXL = {
  borderRadius: 18,
};
export const roundedXXXL = {
  borderRadius: 24,
};
export const roundedFull = {
  borderRadius: "50%",
};

/* ------ BORDER WIDTH ----- */
export const borderW1 = {
  borderWidth: 1,
};

export const borderW2 = {
  borderWidth: 2,
};

export const borderW4 = {
  borderWidth: 4,
};

export const borderXw1 = {
  borderLeftWidth: 1,
  borderRightWidth: 1,
};

export const borderXw2 = {
  borderLeftWidth: 2,
  borderRightWidth: 2,
};

export const borderXw4 = {
  borderLeftWidth: 4,
  borderRightWidth: 4,
};

export const borderYw1 = {
  borderTopWidth: 1,
  borderBottomWidth: 1,
};

export const borderYw2 = {
  borderTopWidth: 2,
  borderBottomWidth: 2,
};

export const borderYw4 = {
  borderTopWidth: 4,
  borderBottomWidth: 4,
};

export const borderBottomW1 = {
  borderBottomWidth: 1,
};

export const borderBottomW2 = {
  borderBottomWidth: 2,
};

export const borderBottomW4 = {
  borderBottomWidth: 4,
};

/* ------ BORDER COLOR ----- */

export const borderColor = (color: string) => ({
  borderColor: color,
});

export const borderPrimary = (theme: "light" | "dark") => ({
  borderColor: colors[theme].primary,
});

export const borderSecondary = (theme: "light" | "dark") => ({
  borderColor: colors[theme].secondary,
});

export const borderDefault = (theme: "light" | "dark") => ({
  borderColor: colors[theme].default,
});

export const borderSuccess = (theme: "light" | "dark") => ({
  borderColor: colors[theme].success,
});

export const borderWarning = (theme: "light" | "dark") => ({
  borderColor: colors[theme].warning,
});

export const borderDanger = (theme: "light" | "dark") => ({
  borderColor: colors[theme].danger,
});
