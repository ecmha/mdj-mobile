declare type Palette = {
  background: string;
  foreground: string;
  divider: string;
  focus: string;
  default: string;
  content_1: string;
  content_2: string;
  content_3: string;
  content_4: string;
  secondary: string;
  primary: string;
  primary_light: string;
  success: string;
  warning: string;
  danger: string;
  tabs_bg: string;
};

declare type ColorType = keyof Palette;

declare type ThemeType = "light" | "dark"; 