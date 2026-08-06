import { ImageStyle, StyleProp, TextStyle, ViewStyle } from "react-native";

export type SViewStyle = StyleProp<ViewStyle>;
export type STextStyle = StyleProp<TextStyle>;
export type SImageStyle = StyleProp<ImageStyle>;
export type ComponentPresetStyle<
  T extends string | number,
  S extends string | number,
  ST extends ViewStyle | TextStyle
> = Record<`${T}_${S}`, StyleProp<ST>>;
