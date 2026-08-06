import { BottomTabbar } from "@/components";
import {
  AssetScreen,
  PortfolioScreen,
  RegionScreen,
  SettingScreen,
} from "@/screens";
import {
  BottomTabNavigationProp,
  createBottomTabNavigator,
} from "@react-navigation/bottom-tabs";
import { StaticParamList, useNavigation } from "@react-navigation/native";
import React from "react";

export const AppTabNavigator = createBottomTabNavigator({
  tabBar: (props) => <BottomTabbar {...props} />,
  screenOptions: {
    animation: "shift",
  },
  screens: {
    Portfolio: {
      screen: PortfolioScreen,
      options: { headerShown: false },
    },
    Asset: {
      screen: AssetScreen,
      options: { headerShown: false },
    },
    Region: {
      screen: RegionScreen,
      options: { headerShown: false },
    },
    Setting: {
      screen: SettingScreen,
      options: { headerShown: false },
    },
  },
});

export type AppTabParamList = StaticParamList<typeof AppTabNavigator>;

export type AppTabNavigationProps<T extends keyof AppTabParamList> =
  BottomTabNavigationProp<AppTabParamList, T>;

export function useAppTabNavigation<T extends keyof AppTabParamList>() {
  return useNavigation<AppTabNavigationProps<T>>();
}
