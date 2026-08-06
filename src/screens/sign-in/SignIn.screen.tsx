import { SignInForm } from "./components/SignInForm.component";
import * as hooks from "./SignIn.hooks";
import { useHeaderHeight } from "@react-navigation/elements";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import { ScrollView } from "react-native";

// SignIn Screen Component
export const SignInScreen = () => {
  const { signInMutation } = hooks.useSignIn();
  const headerHeight = useHeaderHeight();

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      keyboardShouldPersistTaps="handled"
    >
      <KeyboardAvoidingView
        className="flex-1"
        behavior="padding"
        keyboardVerticalOffset={headerHeight}
      >
        <SignInForm
          onSubmit={signInMutation.mutateAsync}
          isLoading={signInMutation.isPending}
        />
      </KeyboardAvoidingView>
    </ScrollView>
  );
};
