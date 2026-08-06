import { THEME } from "@/theme";
import { DEFAULT_COLOR_SCHEME_NAME } from "@/configs/constants";
import { useColorScheme } from "nativewind";

export const useColors = () => {
  const { colorScheme = DEFAULT_COLOR_SCHEME_NAME } = useColorScheme();
  const theme = THEME[colorScheme as "light" | "dark"];
  return theme;
};
