import {
  Button,
  OTP,
  OTPRef,
  Pincode,
  PincodeRef,
  Separator,
  Text,
} from "@/components";
import React, { useRef, useState } from "react";
import { ScrollView, View } from "react-native";

export const PincodeScreen = () => {
  const [pin, setPin] = useState("");
  const [otp, setOtp] = useState("");

  const pincodeRef = useRef<PincodeRef>(null);
  const otpRef = useRef<OTPRef>(null);

  const handleFocus = () => pincodeRef.current?.focus();

  const handleBlur = () => pincodeRef.current?.blur();

  const handleClear = () => pincodeRef.current?.clear();

  const handleShake = () => pincodeRef.current?.shake();

  const handleFocusOtp = () => otpRef.current?.focus();

  const handleBlurOtp = () => otpRef.current?.blur();

  const handleClearOtp = () => otpRef.current?.clear();

  const handleShakeOtp = () => otpRef.current?.shake();

  return (
    <ScrollView>
      <View className="gap-4 p-4">
        <Text variant="muted">Pincode</Text>

        <Pincode
          ref={pincodeRef}
          value={pin}
          onChange={setPin}
          onFulfill={() =>
            console.log(`Pincode fulfilled with content: ${pin}`)
          }
          className="rounded-lg bg-muted-foreground/20"
          maxLength={6}
        />

        <View className="flex-row items-center gap-4">
          <Button onPress={handleFocus} size="icon">
            <Text>F</Text>
          </Button>

          <Button onPress={handleBlur} size="icon">
            <Text>B</Text>
          </Button>

          <Button onPress={handleClear} size="icon">
            <Text>C</Text>
          </Button>

          <Button onPress={handleShake} size="icon">
            <Text>S</Text>
          </Button>
        </View>

        <Separator />
      </View>

      <View className="gap-4 p-4">
        <Text variant="muted">OTP</Text>

        <OTP
          ref={otpRef}
          value={otp}
          onChange={setOtp}
          onFulfill={() => console.log(`OTP fulfilled with content: ${otp}`)}
          className="self-center"
          maxLength={6}
          groups={2}
        />

        <View className="flex-row items-center gap-4">
          <Button onPress={handleFocusOtp} size="icon">
            <Text>F</Text>
          </Button>

          <Button onPress={handleBlurOtp} size="icon">
            <Text>B</Text>
          </Button>

          <Button onPress={handleClearOtp} size="icon">
            <Text>C</Text>
          </Button>

          <Button onPress={handleShakeOtp} size="icon">
            <Text>S</Text>
          </Button>
        </View>

        <Separator />
      </View>
    </ScrollView>
  );
};
