import { useAppNavigation } from "@/navigators";
import { useCallback, useLayoutEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ForgotPasswordFormValues } from "@/schemas";

export const useForgotPassword = () => {
  const navigation = useAppNavigation<"ForgotPassword">();
  const { t } = useTranslation("forgotPassword");
  const [isLoading, setIsLoading] = useState(false);

  /// navigations
  useLayoutEffect(
    useCallback(() => {
      navigation.setOptions({
        title: t("title"),
        headerLargeTitle: true,
        headerShadowVisible: false,
      });
    }, [])
  );

  const handleForgotPassword = useCallback(
    async (values: ForgotPasswordFormValues) => {
      try {
        setIsLoading(true);

        // TODO: Implement actual forgot password API call
        console.log("Forgot password request for email:", values.email);

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve as () => void, 2000));

        // TODO: Show success message and navigate back to sign in
        navigation.navigate("SignIn");
      } catch (error) {
        console.error("Forgot password error:", error);
        // TODO: Show error message
      } finally {
        setIsLoading(false);
      }
    },
    [navigation]
  );

  return {
    handleForgotPassword,
    isLoading,
  };
};
