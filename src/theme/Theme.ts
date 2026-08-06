import { DefaultTheme, DarkTheme, type Theme } from "@react-navigation/native";
import { typography } from "./Typography";

export const THEME = {
  light: {
    background: "hsl(0 0% 100%)",
    foreground: "hsl(0 0% 3.9%)",
    card: "hsl(0 0% 100%)",
    cardForeground: "hsl(0 0% 3.9%)",
    popover: "hsl(0 0% 100%)",
    popoverForeground: "hsl(0 0% 3.9%)",
    primary: "hsl(0 0% 9%)",
    primaryForeground: "hsl(0 0% 98%)",
    secondary: "hsl(0 0% 96.1%)",
    secondaryForeground: "hsl(0 0% 9%)",
    muted: "hsl(210 14% 93%)",
    mutedForeground: "hsl(212 14% 40%)",
    accent: "hsl(0 0% 96.1%)",
    accentForeground: "hsl(0 0% 9%)",
    destructive: "hsl(0 84.2% 60.2%)",
    border: "hsl(0 0% 89.8%)",
    input: "hsl(0 0% 89.8%)",
    ring: "hsl(0 0% 63%)",
    radius: "0.625rem",
    chart1: "hsl(12 76% 61%)",
    chart2: "hsl(173 58% 39%)",
    chart3: "hsl(197 37% 24%)",
    chart4: "hsl(43 74% 66%)",
    chart5: "hsl(27 87% 67%)",
  },
  dark: {
    background: "hsl(212 14% 19%)",
    foreground: "hsl(0 0% 100%)",
    card: "hsl(12 76% 61%)",
    cardForeground: "hsl(0 0% 98%)",
    popover: "hsl(0 0% 3.9%)",
    popoverForeground: "hsl(0 0% 98%)",
    primary: "hsl(174 72% 46%)",
    primaryForeground: "hsl(0 0% 0%)",
    secondary: "hsl(0 0% 14.9%)",
    secondaryForeground: "hsl(0 0% 98%)",
    muted: "hsl(212 14% 25%)",
    mutedForeground: "hsl(210 14% 65%)",
    accent: "hsl(0 0% 14.9%)",
    accentForeground: "hsl(0 0% 98%)",
    destructive: "hsl(0 70.9% 59.4%)",
    border: "hsl(0 0% 14.9%)",
    input: "hsl(0 0% 14.9%)",
    ring: "hsl(300 0% 45%)",
    radius: "0.625rem",
    chart1: "hsl(220 70% 50%)",
    chart2: "hsl(160 60% 45%)",
    chart3: "hsl(30 80% 55%)",
    chart4: "hsl(280 65% 60%)",
    chart5: "hsl(340 75% 55%)",
  },
};

const fonts: Theme["fonts"] = {
  regular: {
    fontFamily: typography.regular,
    fontWeight: "normal",
  },
  medium: {
    fontFamily: typography.medium,
    fontWeight: "normal",
  },
  bold: {
    fontFamily: typography.bold,
    fontWeight: "normal",
  },
  heavy: {
    fontFamily: typography.extraBold,
    fontWeight: "normal",
  },
} as const;

export const NAV_THEME: Record<"light" | "dark", Theme> = {
  light: {
    ...DefaultTheme,
    dark: false,
    colors: {
      background: THEME.light.background,
      border: THEME.light.border,
      card: THEME.light.card,
      notification: THEME.light.destructive,
      primary: THEME.light.primary,
      text: THEME.light.foreground,
    },
    fonts,
  },
  dark: {
    ...DarkTheme,
    dark: true,
    colors: {
      background: THEME.dark.background,
      border: THEME.dark.border,
      card: THEME.dark.card,
      notification: THEME.dark.destructive,
      primary: THEME.dark.primary,
      text: THEME.dark.foreground,
    },
    fonts,
  },
};
