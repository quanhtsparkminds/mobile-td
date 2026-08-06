import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { useIsFocused } from "@react-navigation/native";

import * as hooks from "./SignUp.hooks";
import * as Components from "./components";

export const SignUpScreen = () => {
  const {} = hooks.useSignUp();
  const isFocused = useIsFocused();

  return (
    <KeyboardAwareScrollView
      keyboardDismissMode="interactive"
      enabled={isFocused}
      contentInsetAdjustmentBehavior="automatic"
      disableScrollOnKeyboardHide
    >
      <Components.SignUpForm onSubmit={async () => {}} isLoading={false} />
    </KeyboardAwareScrollView>
  );
};
