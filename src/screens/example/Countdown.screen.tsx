import React, { useMemo } from "react";
import { View } from "react-native";
import { Button, Icon, Text } from "@/components";
import { useCountdown } from "@/hooks";
import { Pause, Play, RotateCcw } from "lucide-react-native";
import Animated, {
  FadeIn,
  FadeInUp,
  FadeOutDown,
} from "react-native-reanimated";

export const CountdownScreen = () => {
  const [value, { run, pause, reset, isRunning }] = useCountdown({
    initialValue: 120,
    onFinish: () => {
      console.log("Countdown finished");
    },
    autoRun: false,
  });

  const formattedValue = useMemo(() => {
    const hours = Math.floor(value / 3600);
    const minutes = Math.floor((value % 3600) / 60);
    const seconds = value % 60;

    let result = "";

    result += `${hours.toString().padStart(2, "0")}:`;

    result += `${minutes.toString().padStart(2, "0")}:`;

    result += `${seconds.toString().padStart(2, "0")}`;

    return result;
  }, [value]);

  return (
    <View className="pb-safe flex-1">
      <View className="flex-1 items-center justify-center gap-4">
        <Text variant="h1">{value} seconds</Text>
        <Text>
          {formattedValue.split("").map((item, index) => (
            <Animated.View
              key={`${item}-${index}`}
              entering={FadeInUp}
              exiting={FadeOutDown}
              className="flex-row"
            >
              <Text variant="h1">{item}</Text>
            </Animated.View>
          ))}
        </Text>
      </View>
      <View className="flex-row items-center justify-center gap-2 px-4">
        <Button onPress={reset} variant="outline" size="icon">
          <Icon as={RotateCcw} />
        </Button>
        <Button onPress={isRunning ? pause : run} size="icon">
          <Animated.View entering={FadeIn} key={isRunning ? "pause" : "play"}>
            <Icon as={isRunning ? Pause : Play} className="color-background" />
          </Animated.View>
        </Button>
      </View>
    </View>
  );
};
