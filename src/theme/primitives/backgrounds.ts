import {colors} from "@/theme/variables/colors";

export const bgColorDefault = (theme: "light" | "dark") => ({
  backgroundColor: colors[theme].background,
});

export const bgColor = (color: string) => ({
  backgroundColor: color,
});

export const bgPrimary = (theme: "light" | "dark") => ({
  backgroundColor: colors[theme].primary,
});

export const bgLight = (theme: "light" | "dark") => ({
  backgroundColor: colors[theme].background_light,
});

export const bgSecondary = (theme: "light" | "dark") => ({
  backgroundColor: colors[theme].secondary,
});

export const bgDefault = (theme: "light" | "dark") => ({
  backgroundColor: colors[theme].background,
});

export const bgSuccess = (theme: "light" | "dark") => ({
  backgroundColor: colors[theme].success,
});

export const bgWarning = (theme: "light" | "dark") => ({
  backgroundColor: colors[theme].warning,
});

export const bgDanger = (theme: "light" | "dark") => ({
  backgroundColor: colors[theme].danger,
});
