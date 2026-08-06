import { cn } from "@/lib/utils";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { PlatformPressable } from "@react-navigation/elements";
import { Image } from "react-native";
import Animated, {
  FadeIn,
  FadeOut,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import * as Types from "./bottom-tabbar.types";
import { Text } from "@/components/ui";
import { images } from "@/assets";
import { useTheme } from "@react-navigation/native";

const tabs: Types.TTabRoute[] = [
  {
    key: "portfolio",
    label: "Portfolio",
    name: "Portfolio",
    icon: images.tab_portfolio,
  },
  {
    key: "asset",
    label: "Asset",
    name: "Asset",
    icon: images.tab_asset,
  },
  {
    key: "region",
    label: "Region",
    name: "Region",
    icon: images.tab_region,
  },
  {
    key: "setting",
    label: "Setting",
    name: "Setting",
    icon: images.tab_setting,
  },
];

export const BottomTabbar = ({ state, navigation }: BottomTabBarProps) => {
  const handleTabPress = (route: any, isFocused: boolean) => {
    if (!route) return;

    const event = navigation.emit({
      type: "tabPress",
      target: route.key,
      canPreventDefault: true,
    });

    if (!isFocused && !event.defaultPrevented) {
      navigation.navigate(route.name);
    }
  };

  return (
    <Animated.View
      entering={FadeIn}
      exiting={FadeOut}
      className="pb-safe flex-row border-t-[0.5px] border-gray-700 pt-5"
    >
      {tabs.map((tabRoute, index) => {
        const route = state.routes.find((r) => r.name === tabRoute.name);
        const isFocused = route
          ? state.index === state.routes.indexOf(route)
          : false;

        return (
          <TabItem
            key={tabRoute.key}
            route={route}
            isFocused={isFocused}
            onPress={() => handleTabPress(route, isFocused)}
            tabRoute={tabRoute}
          />
        );
      })}
    </Animated.View>
  );
};

const TabItem = ({ route, isFocused, onPress, tabRoute }: any) => {
  const theme = useTheme();
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: withSpring(isFocused ? -6 : 0, {
            damping: 15,
            stiffness: 150,
          }),
        },
      ],
      alignItems: "center",
    };
  });

  return (
    <PlatformPressable
      key={route?.key || tabRoute.key}
      className="flex-1 "
      onPress={onPress}
    >
      <Animated.View style={animatedStyle}>
        <Animated.View
          className={cn("items-center gap-[2px]", isFocused && "")}
        >
          <Image
            source={tabRoute.icon}
            className="h-5 w-5"
            style={{ tintColor: isFocused ? theme.colors.primary : "#fff" }}
          />
          <Text
            className={cn(
              isFocused && "font-semibold text-primary",
              "text-[14px]"
            )}
          >
            {tabRoute.label}
          </Text>
        </Animated.View>
      </Animated.View>
    </PlatformPressable>
  );
};
