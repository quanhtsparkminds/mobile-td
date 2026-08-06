import { ScrollView } from "react-native";
import { useTranslation } from "react-i18next";
import { ForgotPasswordForm } from "./components";

import * as hooks from "./ForgotPassword.hooks";

export const ForgotPasswordScreen = () => {
  const { t } = useTranslation();
  const { handleForgotPassword, isLoading } = hooks.useForgotPassword();

  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic">
      <ForgotPasswordForm
        onSubmit={handleForgotPassword}
        isLoading={isLoading}
      />
    </ScrollView>
  );
};
