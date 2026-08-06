import { Platform } from "react-native";

const getTypography = (fontName: string) => ({
  bold: Platform.select({
    android: `${fontName}-Bold`,
    default: `${fontName}-Bold`,
  }),
  boldItalic: Platform.select({
    android: `${fontName}-BoldItalic`,
    default: `${fontName}-BoldItalic`,
  }),
  extraBold: Platform.select({
    android: `${fontName}-ExtraBold`,
    default: `${fontName}-ExtraBold`,
  }),
  extraBoldItalic: Platform.select({
    android: `${fontName}-ExtraBoldItalic`,
    default: `${fontName}-ExtraBoldItalic`,
  }),
  italic: Platform.select({
    android: `${fontName}-Italic`,
    default: `${fontName}-Italic`,
  }),
  light: Platform.select({
    android: `${fontName}-Light`,
    default: `${fontName}-Light`,
  }),
  lightItalic: Platform.select({
    android: `${fontName}-LightItalic`,
    default: `${fontName}-LightItalic`,
  }),
  medium: Platform.select({
    android: `${fontName}-Medium`,
    default: `${fontName}-Medium`,
  }),
  mediumItalic: Platform.select({
    android: `${fontName}-MediumItalic`,
    default: `${fontName}-MediumItalic`,
  }),
  regular: Platform.select({
    android: `${fontName}-Regular`,
    default: `${fontName}-Regular`,
  }),
  semiBold: Platform.select({
    android: `${fontName}-SemiBold`,
    default: `${fontName}-SemiBold`,
  }),
  semiBoldItalic: Platform.select({
    android: `${fontName}-SemiBoldItalic`,
    default: `${fontName}-SemiBoldItalic`,
  }),
});

export const typography = getTypography("Montserrat");
export type KTypography = keyof typeof typography;
