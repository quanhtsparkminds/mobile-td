import { storage, StorageKeys } from "@/utils";
import { NAV_THEME } from "@/theme";
import {
  StatusBar,
  useColorScheme as useSystemColorScheme,
} from "react-native";
import { useMMKVString } from "react-native-mmkv";
import { DEFAULT_COLOR_SCHEME_NAME } from "@/configs";
import { useLayoutEffect } from "react";
import { useColorScheme as useNativeWindColorScheme } from "nativewind";

export const useNavigationTheme = () => {
  const systemColorScheme = useSystemColorScheme();

  // Get stored color scheme from storage
  const [storedColorScheme] = useMMKVString(
    StorageKeys.colorSchemeName,
    storage
  );

  // Get current color scheme from nativewind
  // only return light or dark
  const {
    colorScheme: nativeWindColorScheme,
    setColorScheme: setNativeWindColorScheme,
  } = useNativeWindColorScheme();

  // Get current color scheme with default value
  // include dark / light / system
  const currentColorScheme = (storedColorScheme ||
    DEFAULT_COLOR_SCHEME_NAME) as "light" | "dark" | "system";

  // Get theme based on current color scheme
  // only accept light or dark
  const theme = NAV_THEME[nativeWindColorScheme as "light" | "dark"];

  // Set initial color scheme
  useLayoutEffect(
    () => {
      setNativeWindColorScheme(currentColorScheme);
      if (currentColorScheme === "system") {
        StatusBar.setBarStyle(
          systemColorScheme === "dark" ? "light-content" : "dark-content"
        );
      } else {
        StatusBar.setBarStyle(
          nativeWindColorScheme === "dark" ? "light-content" : "dark-content"
        );
      }
    },
    // subscribe to system color scheme for status bar style
    [systemColorScheme]
  );

  // Return theme and current color scheme
  return { theme, colorScheme: currentColorScheme };
};
