import { Pressable, TextInput, View } from "react-native";
import { useBoolean } from "@/hooks";
import { cn } from "@/lib/utils";
import { Separator, Text } from "@/components/ui";
import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import Animated, {
  FadeInUp,
  FadeOutDown,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";

type OTPProps = {
  /**
   * The value of the OTP
   */
  value: string;
  /**
   * The function to call when the OTP is changed
   */
  onChange: (value: string) => void;
  /**
   * The maximum length of the OTP
   */
  maxLength?: number;
  /**
   * The function to call when the OTP is fulfilled
   */
  onFulfill?: () => void;
  /**
   * The class name of the OTP
   */
  className?: string;
  /**
   * Whether the OTP should be auto focused
   */
  autoFocus?: boolean;
  /**
   * Number of groups to divide the OTP into. If maxLength % groups !== 0, no grouping will be applied
   */
  groups?: number;
};

export type OTPRef = {
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

export const OTP = forwardRef<OTPRef, OTPProps>(
  (
    { value, onChange, maxLength = 6, onFulfill, className, autoFocus, groups },
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

    // Check if grouping should be applied
    const shouldGroup = groups && groups > 1 && maxLength % groups === 0;
    const itemsPerGroup = shouldGroup ? maxLength / groups : maxLength;

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
          className="flex-row items-center"
          onPress={() => inputRef.current?.focus()}
          style={{ transform: [{ translateX: maxLength }] }}
        >
          {Array.from({ length: maxLength }).map((_, index, { length }) => {
            const shouldShowSeparator =
              shouldGroup && index > 0 && index % itemsPerGroup === 0;

            return (
              <View key={index} className="flex-row items-center">
                {shouldShowSeparator && (
                  <Separator
                    className="mx-2 w-2"
                    style={{ transform: [{ translateX: -index }] }}
                  />
                )}
                <OTPItem
                  isActive={
                    Math.min(value?.length, length - 1) === index &&
                    isFocused.value
                  }
                  isFirst={index === 0}
                  isLast={index === maxLength - 1}
                  value={value[index]}
                  index={index}
                />
              </View>
            );
          })}
        </Pressable>
      </Animated.View>
    );
  }
);

type OTPItemProps = {
  /**
   * Whether the OTP item is active
   */
  isActive: boolean;
  /**
   * The class name of the OTP item
   */
  className?: string;
  /**
   * Whether the OTP item is first
   */
  isFirst: boolean;
  /**
   * Whether the OTP item is last
   */
  isLast: boolean;
  /**
   * The value of the OTP item
   */
  value: string;
  /**
   * The index of the OTP item
   */
  index: number;
};

const OTPItem = ({
  isActive,
  className,
  isFirst,
  isLast,
  value,
  index,
}: OTPItemProps) => {
  return (
    <View
      className={cn(
        "h-10 w-10 items-center justify-center border border-input",
        isFirst && "rounded-l-md",
        isLast && "rounded-r-md",
        isActive && "border-primary",
        className
      )}
      style={{
        transform: [{ translateX: -index }],
        zIndex: Number(isActive),
      }}
    >
      {!!value && (
        <Animated.View entering={FadeInUp} exiting={FadeOutDown}>
          <Text>{value}</Text>
        </Animated.View>
      )}
    </View>
  );
};
