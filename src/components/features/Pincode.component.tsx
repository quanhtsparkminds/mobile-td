import { useBoolean, useColors } from "@/hooks";
import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { Pressable, TextInput, View } from "react-native";
import Animated, {
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
  withSequence,
  useSharedValue,
} from "react-native-reanimated";

type PincodeProps = {
  /**
   * The value of the pincode
   */
  value: string;
  /**
   * The function to call when the pincode is changed
   */
  onChange: (value: string) => void;
  /**
   * The maximum length of the pincode
   */
  maxLength?: number;
  /**
   * The function to call when the pincode is fulfilled
   */
  onFulfill?: () => void;
  /**
   * The class name of the pincode
   */
  className?: string;
  /**
   * Whether the pincode should be auto focused
   */
  autoFocus?: boolean;
};

export type PincodeRef = {
  /**
   * The function to call to focus the pincode
   */
  focus: () => void;
  /**
   * The function to call to blur the pincode
   */
  blur: () => void;
  /**
   * The function to call to clear the pincode
   */
  clear: () => void;
  /**
   * The function to call to shake the pincode
   */
  shake: () => void;
};

export const Pincode = forwardRef<PincodeRef, PincodeProps>(
  (
    { value = "", onChange, maxLength = 4, onFulfill, className, autoFocus },
    ref
  ) => {
    const isFocused = useBoolean();
    const inputRef = useRef<TextInput>(null);
    const shakeAnimation = useSharedValue(0);

    useImperativeHandle(ref, () => ({
      focus: () => {
        inputRef.current?.focus();
      },
      blur: () => {
        inputRef.current?.blur();
      },
      clear: () => {
        onChange("");
      },
      shake: () => {
        shakeAnimation.value = withSequence(
          withTiming(10, { duration: 50 }),
          withTiming(-10, { duration: 50 }),
          withTiming(10, { duration: 50 }),
          withTiming(-10, { duration: 50 }),
          withTiming(0, { duration: 50 })
        );
      },
    }));

    useEffect(() => {
      if (value.length === maxLength) {
        onFulfill?.();
      }
    }, [value, maxLength]);

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ translateX: shakeAnimation.value }],
    }));

    const handleChangeText = (text: string) => {
      if (/^\d*$/.test(text)) {
        onChange(text);
      }
    };

    return (
      <Animated.View style={animatedStyle} className={className}>
        <TextInput
          className="absolute opacity-0"
          keyboardType="number-pad"
          ref={inputRef}
          value={value}
          onChangeText={handleChangeText}
          maxLength={maxLength}
          onFocus={isFocused.setTrue}
          onBlur={isFocused.setFalse}
          autoFocus={autoFocus}
        />

        <Pressable
          className="min-h-10 flex-row items-center justify-center gap-4"
          onPress={() => inputRef.current?.focus()}
        >
          {Array.from({ length: maxLength }).map((_, index) => (
            <PincodeItem
              key={index}
              isFilled={value[index] !== undefined}
              isActive={value?.length === index && isFocused.value}
            />
          ))}
        </Pressable>
      </Animated.View>
    );
  }
);

Pincode.displayName = "Pincode";

type PincodeItemProps = {
  /**
   * Whether the pincode item is filled
   */
  isFilled: boolean;
  /**
   * Whether the pincode item is active
   */
  isActive: boolean;
};

const PincodeItem = ({ isFilled, isActive }: PincodeItemProps) => {
  const colors = useColors();
  const filledInNumber = useDerivedValue(() => withTiming(isFilled ? 1 : 0));
  const activeInNumber = useDerivedValue(() => withTiming(isActive ? 1 : 0));

  const animStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      filledInNumber.value,
      [0, 1],
      [colors.muted, colors.primary]
    ),
  }));

  const backdropStyle = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(activeInNumber.value, [0, 1], [1, 1.4]) }],
  }));

  return (
    <View>
      <Animated.View
        style={animStyle}
        className="h-3 w-3 rounded-full bg-muted-foreground/30"
      />
      <Animated.View
        style={backdropStyle}
        className="absolute -z-10 h-3 w-3 rounded-full bg-primary/60 blur-lg"
      />
    </View>
  );
};
