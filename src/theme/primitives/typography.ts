import { colors } from '@/theme/variables/colors';
import { fontSize } from '@/theme/variables/typo';
import { StyleSheet } from 'react-native';

/* ------ FONT FAMILY ----- */

export const fontFamily = StyleSheet.create({
  sfBold: {
    fontFamily: 'SFProText-Semibold',
  },
  sfRegular: {
    fontFamily: 'SFProText-Light',
  },
  sfItalic: {
    fontFamily: 'SFProText-LightItalic',
  },
  cormorant: {
    fontFamily: 'CormorantUpright-Light',
  },
  cormorantBold: {
    fontFamily: 'CormorantUpright-Bold',
  },
});

/* ------ TEXT ALIGN ----- */

export const textAlign = StyleSheet.create({
  auto: {
    textAlign: 'auto',
  },
  center: {
    textAlign: 'center',
  },
  justify: {
    textAlign: 'justify',
  },
  left: {
    textAlign: 'left',
  },
  right: {
    textAlign: 'right',
  },
});

/* ------ TEXT DECORATION ----- */

export const textDecorationLine = StyleSheet.create({
  lineThrough: {
    textDecorationLine: 'line-through',
  },
  underline: {
    textDecorationLine: 'underline',
  },
  none: {
    textDecorationLine: 'none',
  },
});

export const textDecorationStyle = StyleSheet.create({
  dashed: {
    textDecorationStyle: 'dashed',
  },
  dotted: {
    textDecorationStyle: 'dotted',
  },
  double: {
    textDecorationStyle: 'double',
  },
  solid: {
    textDecorationStyle: 'solid',
  },
});

/* ------ FONT SIZE ----- */

export const textTiny = {
  fontSize: fontSize.tiny,
};

export const textMini = {
  fontSize: fontSize.mini,
};

export const textSmall = {
  fontSize: fontSize.small,
};

export const textMedium = {
  fontSize: fontSize.medium,
};

export const textBig = {
  fontSize: fontSize.big,
};

export const textLarge = {
  fontSize: fontSize.large,
};
export const textLargeX1 = {
  fontSize: fontSize.large_1,
};

export const textLargeX2 = {
  fontSize: fontSize.large_2,
};

export const textLargeX3 = {
  fontSize: fontSize.large_3,
};

export const textLargeX4 = {
  fontSize: fontSize.large_4,
};

export const textMaxi = {
  fontSize: fontSize.maxi,
};

/* ------ TEXT COLOR ----- */

export const textColorDefault = (theme: 'light' | 'dark') => ({
  color: colors[theme].foreground,
});

export const textColor = (color: string) => ({
  color: color,
});

export const textPrimary = (theme: 'light' | 'dark') => ({
  color: colors[theme].primary,
});

export const textSecondary = (theme: 'light' | 'dark') => ({
  color: colors[theme].secondary,
});

export const textDefault = (theme: 'light' | 'dark') => ({
  color: colors[theme].default,
});

export const textSuccess = (theme: 'light' | 'dark') => ({
  color: colors[theme].success,
});

export const textWarning = (theme: 'light' | 'dark') => ({
  color: colors[theme].warning,
});

export const textDanger = (theme: 'light' | 'dark') => ({
  color: colors[theme].danger,
});
