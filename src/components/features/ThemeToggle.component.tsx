import { Computer, Moon, Sun } from "lucide-react-native";
import { storage, StorageKeys } from "@/utils";
import { ToggleGroup, ToggleGroupIcon, ToggleGroupItem } from "../ui";
import { useMMKVString } from "react-native-mmkv";
import { colorScheme } from "nativewind";
import {
  StatusBar,
  useColorScheme as useSystemColorScheme,
} from "react-native";
import { EColorSchemeName } from "@/enums";

export function ThemeToggle() {
  const systemColorScheme = useSystemColorScheme();

  const [storedColorScheme, setStoredColorScheme] = useMMKVString(
    StorageKeys.colorSchemeName,
    storage
  );

  function toggleColorScheme(newTheme: EColorSchemeName) {
    setStoredColorScheme(newTheme);
    colorScheme.set(newTheme);
    if (newTheme === EColorSchemeName.SYSTEM) {
      StatusBar.setBarStyle(
        systemColorScheme === EColorSchemeName.DARK
          ? "light-content"
          : "dark-content"
      );
    } else
      StatusBar.setBarStyle(
        newTheme === EColorSchemeName.DARK ? "light-content" : "dark-content"
      );
  }

  return (
    <ToggleGroup
      value={storedColorScheme}
      onValueChange={(value) => toggleColorScheme(value as EColorSchemeName)}
      variant="outline"
      type="single"
    >
      <ToggleGroupItem
        value={EColorSchemeName.LIGHT}
        aria-label="Toggle light"
        isFirst
      >
        <ToggleGroupIcon as={Sun} />
      </ToggleGroupItem>
      <ToggleGroupItem value={EColorSchemeName.DARK} aria-label="Toggle dark">
        <ToggleGroupIcon as={Moon} />
      </ToggleGroupItem>
      <ToggleGroupItem
        value={EColorSchemeName.SYSTEM}
        aria-label="Toggle system"
        isLast
      >
        <ToggleGroupIcon as={Computer} />
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
