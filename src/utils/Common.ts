import { Timeframe } from "@/enums";
import { Platform } from "react-native";

export const blankFunct = () => {};
export const debugLog: Console["log"] = __DEV__ ? console.log : blankFunct;

export const isIOS = Platform.OS === "ios";
export const isAndroid = Platform.OS === "android";

export const timeFrameToMinutes = (timeframe: Timeframe): number => {
  switch (timeframe) {
    case Timeframe.INTERVAL_1m:
      return 1;
    case Timeframe.INTERVAL_3m:
      return 3;
    case Timeframe.INTERVAL_5m:
      return 5;
    case Timeframe.INTERVAL_15m:
      return 15;
    case Timeframe.INTERVAL_30m:
      return 30;
    case Timeframe.INTERVAL_1h:
      return 60;
    case Timeframe.INTERVAL_2h:
      return 120;
    case Timeframe.INTERVAL_4h:
      return 240;
    case Timeframe.INTERVAL_6h:
      return 360;
    case Timeframe.INTERVAL_8h:
      return 480;
    case Timeframe.INTERVAL_12h:
      return 720;
    case Timeframe.INTERVAL_1d:
      return 1440;
    case Timeframe.INTERVAL_3d:
      return 4320;
    case Timeframe.INTERVAL_1w:
      return 10080;
    case Timeframe.INTERVAL_1M:
      return 43200;
    default:
      return 60; // Default to 1 hour
  }
};
