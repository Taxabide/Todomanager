import {Platform} from 'react-native';

const fontFamily = Platform.select({
  ios: 'System',
  android: 'Roboto',
  default: 'System',
});

export const FontSize = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 17,
  xl: 20,
  xxl: 24,
  xxxl: 30,
  display: 36,
};

export const FontWeight = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  extrabold: '800' as const,
};

export const LineHeight = {
  xs: 16,
  sm: 18,
  md: 22,
  lg: 24,
  xl: 28,
  xxl: 32,
  xxxl: 38,
  display: 44,
};

export const Typography = {
  display: {
    fontFamily,
    fontSize: FontSize.display,
    fontWeight: FontWeight.bold,
    lineHeight: LineHeight.display,
  },
  h1: {
    fontFamily,
    fontSize: FontSize.xxxl,
    fontWeight: FontWeight.bold,
    lineHeight: LineHeight.xxxl,
  },
  h2: {
    fontFamily,
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    lineHeight: LineHeight.xxl,
  },
  h3: {
    fontFamily,
    fontSize: FontSize.xl,
    fontWeight: FontWeight.semibold,
    lineHeight: LineHeight.xl,
  },
  body: {
    fontFamily,
    fontSize: FontSize.md,
    fontWeight: FontWeight.regular,
    lineHeight: LineHeight.md,
  },
  bodyMedium: {
    fontFamily,
    fontSize: FontSize.md,
    fontWeight: FontWeight.medium,
    lineHeight: LineHeight.md,
  },
  bodySm: {
    fontFamily,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.regular,
    lineHeight: LineHeight.sm,
  },
  caption: {
    fontFamily,
    fontSize: FontSize.xs,
    fontWeight: FontWeight.regular,
    lineHeight: LineHeight.xs,
  },
  button: {
    fontFamily,
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    lineHeight: LineHeight.md,
  },
  buttonSm: {
    fontFamily,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    lineHeight: LineHeight.sm,
  },
};
